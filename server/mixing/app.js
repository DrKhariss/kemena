import { config } from "dotenv";
import { randomBytes } from "crypto";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  adminMiddleware,
  authMiddleware,
  clearAuthCookie,
  setAuthCookie,
  signToken,
} from "./auth.js";
import {
  activateSubscription,
  createMixRequest,
  createPendingSubscription,
  ensureAdminUser,
  getActiveSubscriptionForUser,
  getAdminStats,
  getMixRequestsForUser,
  getSubscriptionByReference,
  getSubscriptionsForUser,
  getUserByEmail,
  getUserById,
  initDb,
  listAllMixRequests,
  listAllSubscriptions,
  listSubscribers,
  markTermsAccepted,
  setUserPassword,
  updateMixRequestStatus,
  updateSubscriptionAdmin,
  upsertSubscriber,
  verifyUserPassword,
} from "./db.js";
import {
  inferPlanId,
  isPaystackConfigured,
  makeReceiptCode,
  PLANS,
  verifyPaystack,
} from "./plans.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
config({ path: join(root, ".env") });
config({ path: join(root, ".env.local") });

initDb();
ensureAdminUser();

export const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    role: user.role,
    hasPassword: Boolean(user.password_hash),
    termsAcceptedAt: user.terms_accepted_at,
    createdAt: user.created_at,
  };
}

function subscriptionView(sub) {
  if (!sub) return null;
  const plan = PLANS[sub.plan_id];
  const tracksRemaining =
    sub.tracks_allowed == null ? "Unlimited" : Math.max(sub.tracks_allowed - sub.tracks_used, 0);

  return {
    id: sub.id,
    planId: sub.plan_id,
    planName: plan?.name || sub.plan_id,
    status: sub.status,
    amountNgn: sub.amount_ngn,
    reference: sub.paystack_reference,
    receiptCode: sub.receipt_code,
    tracksAllowed: sub.tracks_allowed,
    tracksUsed: sub.tracks_used,
    tracksRemaining,
    startsAt: sub.starts_at,
    expiresAt: sub.expires_at,
    paidAt: sub.paid_at,
    duration: plan?.duration,
  };
}

function buildReceiptPayload(sub, user) {
  const plan = PLANS[sub.plan_id];
  return {
    ok: true,
    demo: !isPaystackConfigured(),
    reference: sub.paystack_reference,
    receiptCode: sub.receipt_code,
    fullName: user.full_name,
    email: user.email,
    planId: sub.plan_id,
    planName: plan.name,
    tracks: plan.tracks,
    duration: plan.duration,
    amountNgn: sub.amount_ngn,
    paidAt: sub.paid_at,
    hasPassword: Boolean(user.password_hash),
    tracksRemaining:
      sub.tracks_allowed == null ? "Unlimited" : Math.max(sub.tracks_allowed - sub.tracks_used, 0),
  };
}

app.get("/mixing/api/config", (_req, res) => {
  return res.json({ paystackConfigured: isPaystackConfigured() });
});

app.post("/mixing/api/signup", (req, res) => {
  const { email, full_name: fullName } = req.body || {};
  if (!email || !fullName || fullName.trim().length < 2) {
    return res.status(400).json({ error: "Valid email and full name are required." });
  }

  const user = upsertSubscriber({ email, fullName });
  return res.json({ ok: true, user: publicUser(user) });
});

app.post("/mixing/api/terms", (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const user = markTermsAccepted(email);
  if (!user) {
    return res.status(404).json({ error: "User not found. Sign up first." });
  }

  return res.json({ ok: true, user: publicUser(user) });
});

app.post("/mixing/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  const user = getUserByEmail(email);

  if (!user || !verifyUserPassword(user, password)) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = signToken(user);
  setAuthCookie(res, token);
  return res.json({ ok: true, user: publicUser(user) });
});

app.post("/mixing/api/auth/logout", (_req, res) => {
  clearAuthCookie(res);
  return res.json({ ok: true });
});

app.post("/mixing/api/auth/setup-password", (req, res) => {
  const { email, password, reference } = req.body || {};
  if (!email || !password || password.length < 8) {
    return res.status(400).json({ error: "Email and password (min 8 chars) are required." });
  }

  const user = getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: "Account not found." });
  }

  if (reference) {
    const sub = getSubscriptionByReference(reference);
    if (!sub || sub.user_id !== user.id || sub.status !== "active") {
      return res.status(403).json({ error: "Active subscription required before setting a password." });
    }
  } else if (user.role === "subscriber" && !getActiveSubscriptionForUser(user.id)) {
    return res.status(403).json({ error: "No active subscription found for this account." });
  }

  const updated = setUserPassword(user.id, password);
  const token = signToken(updated);
  setAuthCookie(res, token);
  return res.json({ ok: true, user: publicUser(updated) });
});

app.get("/mixing/api/auth/me", authMiddleware, (req, res) => {
  const user = getUserById(req.user.sub);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const activeSubscription = getActiveSubscriptionForUser(user.id);
  const subscriptions = getSubscriptionsForUser(user.id);
  const mixRequests = getMixRequestsForUser(user.id);

  return res.json({
    user: publicUser(user),
    activeSubscription: subscriptionView(activeSubscription),
    subscriptions: subscriptions.map(subscriptionView),
    mixRequests,
  });
});

app.post("/mixing/api/initiate-payment", (req, res) => {
  const { plan_id: planId, email, full_name: fullName } = req.body || {};
  const plan = PLANS[planId];

  if (!plan) {
    return res.status(400).json({ error: "Invalid plan selected." });
  }
  if (!email || !fullName) {
    return res.status(400).json({ error: "Email and full name are required." });
  }

  const user = upsertSubscriber({ email, fullName, termsAccepted: true });
  const reference = `ms-${randomBytes(6).toString("hex")}`;
  const receiptCode = makeReceiptCode(reference);
  createPendingSubscription(user.id, planId, reference, receiptCode);

  return res.json({
    ok: true,
    demo: !isPaystackConfigured(),
    reference,
    amountKobo: plan.priceNgn * 100,
    email: user.email,
    planName: plan.name,
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || null,
  });
});

app.post("/mixing/api/verify-payment", async (req, res) => {
  const { reference } = req.body || {};
  if (!reference) {
    return res.status(400).json({ error: "Payment reference is required." });
  }

  let sub = getSubscriptionByReference(reference);
  if (!sub) {
    return res.status(404).json({ error: "Subscription not found." });
  }

  if (sub.status === "active") {
    const user = getUserById(sub.user_id);
    return res.json(buildReceiptPayload(sub, user));
  }

  if (!isPaystackConfigured()) {
    sub = activateSubscription(reference, new Date().toISOString());
    const user = getUserById(sub.user_id);
    return res.json(buildReceiptPayload(sub, user));
  }

  try {
    const tx = await verifyPaystack(reference);
    if (tx.status !== "success") {
      return res.status(402).json({ error: "Payment was not successful." });
    }

    const planId = tx.metadata?.plan_id || inferPlanId(tx.amount / 100);
    if (!planId || planId !== sub.plan_id) {
      return res.status(402).json({ error: "Payment plan mismatch." });
    }

    if (tx.amount !== PLANS[planId].priceNgn * 100) {
      return res.status(402).json({ error: "Payment amount mismatch." });
    }

    sub = activateSubscription(reference, tx.paid_at || tx.transaction_date);
    const user = getUserById(sub.user_id);
    return res.json(buildReceiptPayload(sub, user));
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
});

app.get("/mixing/api/receipt", async (req, res) => {
  const reference = req.query.reference;
  if (!reference) {
    return res.status(400).json({ error: "Reference is required." });
  }

  const sub = getSubscriptionByReference(reference);
  if (!sub) {
    return res.status(404).json({ error: "Receipt not found." });
  }

  if (sub.status !== "active") {
    if (!isPaystackConfigured()) {
      activateSubscription(reference, new Date().toISOString());
    } else {
      try {
        const tx = await verifyPaystack(reference);
        if (tx.status === "success") {
          activateSubscription(reference, tx.paid_at || tx.transaction_date);
        }
      } catch {
        return res.status(404).json({ error: "Payment not completed yet." });
      }
    }
  }

  const fresh = getSubscriptionByReference(reference);
  const user = getUserById(fresh.user_id);
  return res.json(buildReceiptPayload(fresh, user));
});

app.post("/mixing/api/mix-requests", authMiddleware, (req, res) => {
  const { title, notes } = req.body || {};
  if (!title || title.trim().length < 2) {
    return res.status(400).json({ error: "Track title is required." });
  }

  const user = getUserById(req.user.sub);
  const sub = getActiveSubscriptionForUser(user.id);
  if (!sub) {
    return res.status(403).json({ error: "No active subscription." });
  }

  if (sub.tracks_allowed != null && sub.tracks_used >= sub.tracks_allowed) {
    return res.status(403).json({ error: "Track limit reached for your current plan." });
  }

  const mixRequest = createMixRequest(user.id, sub.id, title, notes);
  return res.json({ ok: true, mixRequest });
});

app.get("/mixing/api/admin/stats", authMiddleware, adminMiddleware, (_req, res) => {
  return res.json(getAdminStats());
});

app.get("/mixing/api/admin/subscribers", authMiddleware, adminMiddleware, (_req, res) => {
  return res.json({ subscribers: listSubscribers() });
});

app.get("/mixing/api/admin/subscriptions", authMiddleware, adminMiddleware, (_req, res) => {
  return res.json({ subscriptions: listAllSubscriptions() });
});

app.get("/mixing/api/admin/mix-requests", authMiddleware, adminMiddleware, (_req, res) => {
  return res.json({ mixRequests: listAllMixRequests() });
});

app.patch("/mixing/api/admin/subscriptions/:id", authMiddleware, adminMiddleware, (req, res) => {
  const updated = updateSubscriptionAdmin(req.params.id, {
    tracksUsed: req.body?.tracks_used,
    status: req.body?.status,
  });
  if (!updated) {
    return res.status(404).json({ error: "Subscription not found." });
  }
  return res.json({ subscription: subscriptionView(updated) });
});

app.patch("/mixing/api/admin/mix-requests/:id", authMiddleware, adminMiddleware, (req, res) => {
  const status = req.body?.status;
  const allowed = ["submitted", "in_progress", "delivered", "revision"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }

  const updated = updateMixRequestStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: "Mix request not found." });
  }
  return res.json({ mixRequest: updated });
});
