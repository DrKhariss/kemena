import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { addMonths, PLANS } from "./plans.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const dataDir = join(root, "data");
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH || join(dataDir, "mixing.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function now() {
  return new Date().toISOString();
}

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      password_hash TEXT,
      role TEXT NOT NULL DEFAULT 'subscriber',
      terms_accepted_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      amount_ngn INTEGER NOT NULL,
      paystack_reference TEXT UNIQUE,
      receipt_code TEXT UNIQUE,
      tracks_allowed INTEGER,
      tracks_used INTEGER NOT NULL DEFAULT 0,
      starts_at TEXT,
      expires_at TEXT,
      paid_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS mix_requests (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      subscription_id TEXT NOT NULL,
      title TEXT NOT NULL,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'submitted',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
    );

    CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
    CREATE INDEX IF NOT EXISTS idx_mix_requests_user ON mix_requests(user_id);
  `);
}

export function ensureAdminUser() {
  const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin_change_me";
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) return;

  const id = randomUUID();
  const timestamp = now();
  const passwordHash = bcrypt.hashSync(password, 10);

  db.prepare(
    `INSERT INTO users (id, email, full_name, password_hash, role, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'admin', ?, ?)`,
  ).run(id, email, "Dashboard Admin", passwordHash, timestamp, timestamp);
}

export function upsertSubscriber({ email, fullName, termsAccepted = false }) {
  const normalizedEmail = email.trim().toLowerCase();
  const timestamp = now();
  const existing = db.prepare("SELECT * FROM users WHERE email = ?").get(normalizedEmail);

  if (existing) {
    db.prepare(
      `UPDATE users SET full_name = ?, terms_accepted_at = COALESCE(?, terms_accepted_at), updated_at = ?
       WHERE id = ?`,
    ).run(
      fullName.trim(),
      termsAccepted ? timestamp : null,
      timestamp,
      existing.id,
    );
    return getUserById(existing.id);
  }

  const id = randomUUID();
  db.prepare(
    `INSERT INTO users (id, email, full_name, role, terms_accepted_at, created_at, updated_at)
     VALUES (?, ?, ?, 'subscriber', ?, ?, ?)`,
  ).run(
    id,
    normalizedEmail,
    fullName.trim(),
    termsAccepted ? timestamp : null,
    timestamp,
    timestamp,
  );

  return getUserById(id);
}

export function markTermsAccepted(email) {
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.trim().toLowerCase());
  if (!user) return null;
  const timestamp = now();
  db.prepare("UPDATE users SET terms_accepted_at = ?, updated_at = ? WHERE id = ?").run(
    timestamp,
    timestamp,
    user.id,
  );
  return getUserById(user.id);
}

export function getUserByEmail(email) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email.trim().toLowerCase()) || null;
}

export function getUserById(id) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) || null;
}

export function setUserPassword(userId, password) {
  const passwordHash = bcrypt.hashSync(password, 10);
  const timestamp = now();
  db.prepare("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?").run(
    passwordHash,
    timestamp,
    userId,
  );
  return getUserById(userId);
}

export function verifyUserPassword(user, password) {
  if (!user?.password_hash) return false;
  return bcrypt.compareSync(password, user.password_hash);
}

export function createPendingSubscription(userId, planId, reference, receiptCode) {
  const plan = PLANS[planId];
  const id = randomUUID();
  const timestamp = now();

  db.prepare(
    `INSERT INTO subscriptions
      (id, user_id, plan_id, status, amount_ngn, paystack_reference, receipt_code,
       tracks_allowed, tracks_used, created_at)
     VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, 0, ?)`,
  ).run(
    id,
    userId,
    planId,
    plan.priceNgn,
    reference,
    receiptCode,
    plan.tracksAllowed,
    timestamp,
  );

  return getSubscriptionByReference(reference);
}

export function activateSubscription(reference, paidAt) {
  const sub = getSubscriptionByReference(reference);
  if (!sub) return null;

  const plan = PLANS[sub.plan_id];
  const startsAt = paidAt || now();
  const expiresAt = addMonths(startsAt, plan.durationMonths);

  db.prepare(
    `UPDATE subscriptions
     SET status = 'active', paid_at = ?, starts_at = ?, expires_at = ?
     WHERE paystack_reference = ?`,
  ).run(startsAt, startsAt, expiresAt, reference);

  return getSubscriptionByReference(reference);
}

export function getSubscriptionByReference(reference) {
  return db.prepare("SELECT * FROM subscriptions WHERE paystack_reference = ?").get(reference) || null;
}

export function getSubscriptionByReceipt(receiptCode) {
  return db.prepare("SELECT * FROM subscriptions WHERE receipt_code = ?").get(receiptCode) || null;
}

export function getActiveSubscriptionForUser(userId) {
  return (
    db
      .prepare(
        `SELECT * FROM subscriptions
         WHERE user_id = ? AND status = 'active'
         ORDER BY paid_at DESC LIMIT 1`,
      )
      .get(userId) || null
  );
}

export function getSubscriptionsForUser(userId) {
  return db
    .prepare("SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId);
}

export function createMixRequest(userId, subscriptionId, title, notes) {
  const id = randomUUID();
  const timestamp = now();
  db.prepare(
    `INSERT INTO mix_requests (id, user_id, subscription_id, title, notes, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'submitted', ?, ?)`,
  ).run(id, userId, subscriptionId, title.trim(), notes?.trim() || null, timestamp, timestamp);

  db.prepare("UPDATE subscriptions SET tracks_used = tracks_used + 1 WHERE id = ?").run(subscriptionId);

  return getMixRequestById(id);
}

export function getMixRequestById(id) {
  return db.prepare("SELECT * FROM mix_requests WHERE id = ?").get(id) || null;
}

export function getMixRequestsForUser(userId) {
  return db
    .prepare("SELECT * FROM mix_requests WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId);
}

export function getAdminStats() {
  const subscribers = db
    .prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'subscriber'")
    .get().count;
  const activeSubs = db
    .prepare("SELECT COUNT(*) AS count FROM subscriptions WHERE status = 'active'")
    .get().count;
  const revenue = db
    .prepare("SELECT COALESCE(SUM(amount_ngn), 0) AS total FROM subscriptions WHERE status = 'active'")
    .get().total;
  const pendingMixes = db
    .prepare("SELECT COUNT(*) AS count FROM mix_requests WHERE status IN ('submitted', 'in_progress')")
    .get().count;

  return { subscribers, activeSubs, revenue, pendingMixes };
}

export function listSubscribers() {
  return db
    .prepare(
      `SELECT u.id, u.email, u.full_name, u.role, u.created_at, u.terms_accepted_at,
              u.password_hash IS NOT NULL AS has_password,
              (
                SELECT COUNT(*) FROM subscriptions s WHERE s.user_id = u.id AND s.status = 'active'
              ) AS active_plans
       FROM users u
       WHERE u.role = 'subscriber'
       ORDER BY u.created_at DESC`,
    )
    .all();
}

export function listAllSubscriptions() {
  return db
    .prepare(
      `SELECT s.*, u.email, u.full_name
       FROM subscriptions s
       JOIN users u ON u.id = s.user_id
       ORDER BY s.created_at DESC`,
    )
    .all();
}

export function listAllMixRequests() {
  return db
    .prepare(
      `SELECT m.*, u.email, u.full_name, s.receipt_code, s.plan_id
       FROM mix_requests m
       JOIN users u ON u.id = m.user_id
       JOIN subscriptions s ON s.id = m.subscription_id
       ORDER BY m.created_at DESC`,
    )
    .all();
}

export function updateMixRequestStatus(id, status) {
  const timestamp = now();
  db.prepare("UPDATE mix_requests SET status = ?, updated_at = ? WHERE id = ?").run(
    status,
    timestamp,
    id,
  );
  return getMixRequestById(id);
}

export function updateSubscriptionAdmin(id, { tracksUsed, status }) {
  const timestamp = now();
  if (tracksUsed !== undefined) {
    db.prepare("UPDATE subscriptions SET tracks_used = ? WHERE id = ?").run(tracksUsed, id);
  }
  if (status) {
    db.prepare("UPDATE subscriptions SET status = ? WHERE id = ?").run(status, id);
  }
  return db.prepare("SELECT * FROM subscriptions WHERE id = ?").get(id);
}

export { db };
