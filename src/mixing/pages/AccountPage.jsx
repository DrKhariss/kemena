import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createMixRequest, updateMixRequest } from "../lib/api.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { formatNgn } from "../lib/subscription.js";

const LEAD_PHONE = import.meta.env.VITE_LEAD_ENGINEER_PHONE || "+234 800 000 0000";

const STATUS_STEPS = ["submitted", "in_progress", "revision", "delivered"];

const STATUS_COPY = {
  submitted: "Submitted",
  in_progress: "In progress",
  revision: "Needs revision",
  delivered: "Delivered",
};

const emptyForm = {
  title: "",
  artistName: "",
  genre: "",
  bpm: "",
  musicalKey: "",
  stemLink: "",
  referenceLinks: "",
  notes: "",
};

function trackProgress(sub) {
  if (!sub) return { used: 0, allowed: null, pct: 0, remaining: "—" };
  const used = sub.tracksUsed || 0;
  const allowed = sub.tracksAllowed;
  if (allowed == null) {
    return { used, allowed: null, pct: 8, remaining: "Unlimited" };
  }
  return {
    used,
    allowed,
    pct: Math.min(100, Math.round((used / allowed) * 100)),
    remaining: Math.max(allowed - used, 0),
  };
}

function StatusPipeline({ status }) {
  const activeIndex = Math.max(0, STATUS_STEPS.indexOf(status));
  return (
    <ol className="status-pipeline">
      {STATUS_STEPS.map((step, index) => (
        <li
          key={step}
          className={`status-pipeline__step ${index <= activeIndex ? "is-done" : ""} ${
            step === status ? "is-current" : ""
          }`}
        >
          <span className="status-pipeline__dot" />
          <span className="status-pipeline__label">{STATUS_COPY[step]}</span>
        </li>
      ))}
    </ol>
  );
}

export default function AccountPage() {
  const { user, account, refresh, logout } = useAuth();
  const sub = account?.activeSubscription;
  const mixes = account?.mixRequests || [];
  const progress = trackProgress(sub);

  const [tab, setTab] = useState("overview");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const counts = useMemo(() => {
    const base = { all: mixes.length, submitted: 0, in_progress: 0, revision: 0, delivered: 0 };
    for (const mix of mixes) {
      if (base[mix.status] != null) base[mix.status] += 1;
    }
    return base;
  }, [mixes]);

  const filteredMixes = useMemo(() => {
    if (statusFilter === "all") return mixes;
    return mixes.filter((mix) => mix.status === statusFilter);
  }, [mixes, statusFilter]);

  const canSubmit = Boolean(sub) && (sub.tracksAllowed == null || progress.remaining > 0);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(mix) {
    setEditingId(mix.id);
    setExpandedId(mix.id);
    setTab("submit");
    setForm({
      title: mix.title || "",
      artistName: mix.artistName || "",
      genre: mix.genre || "",
      bpm: mix.bpm || "",
      musicalKey: mix.musicalKey || "",
      stemLink: mix.stemLink || "",
      referenceLinks: mix.referenceLinks || "",
      notes: mix.notes || "",
    });
    setError("");
    setSuccess("");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (editingId) {
        await updateMixRequest(editingId, form);
        setSuccess("Mix updated. Status tracking stays on this page.");
      } else {
        await createMixRequest(form);
        setSuccess("Mix submitted and saved. Track progress below.");
      }
      resetForm();
      setTab("tracks");
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    ["overview", "Overview"],
    ["submit", editingId ? "Update mix" : "Submit mix"],
    ["tracks", `Tracks (${mixes.length})`],
  ];

  return (
    <div className="account-page mx-auto flex max-w-5xl flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="subtitle mb-3">Subscriber portal</p>
          <h1 className="hero-heading text-3xl sm:text-5xl">Welcome, {user?.fullName}</h1>
          <p className="mt-3 text-sm text-army-light">{user?.email}</p>
        </div>
        <button type="button" className="nav-link" onClick={logout}>
          Log out
        </button>
      </div>

      {!sub ? (
        <div className="card-container mx-auto w-full max-w-xl text-center">
          <p className="text-army-light">No active subscription yet.</p>
          <Link to="/mixing" className="btn-primary mt-6 inline-block max-w-xs no-underline">
            <span>Subscribe now</span>
          </Link>
        </div>
      ) : (
        <>
          <div className="account-stat-grid">
            <article className="account-stat">
              <p className="subtitle !text-[9px]">Plan</p>
              <p className="account-stat__value">{sub.planName}</p>
              <p className="account-stat__meta">{formatNgn(sub.amountNgn)}</p>
            </article>
            <article className="account-stat">
              <p className="subtitle !text-[9px]">Tracks used</p>
              <p className="account-stat__value">
                {progress.used}
                {progress.allowed != null ? ` / ${progress.allowed}` : ""}
              </p>
              <div className="track-meter" aria-hidden="true">
                <span style={{ width: `${progress.pct}%` }} />
              </div>
              <p className="account-stat__meta">{progress.remaining} remaining</p>
            </article>
            <article className="account-stat">
              <p className="subtitle !text-[9px]">Open jobs</p>
              <p className="account-stat__value">
                {counts.submitted + counts.in_progress + counts.revision}
              </p>
              <p className="account-stat__meta">{counts.delivered} delivered</p>
            </article>
            <article className="account-stat">
              <p className="subtitle !text-[9px]">Valid until</p>
              <p className="account-stat__value account-stat__value--sm">
                {sub.expiresAt?.slice(0, 10) || "—"}
              </p>
              <p className="account-stat__meta font-mono text-[10px]">{sub.receiptCode}</p>
            </article>
          </div>

          <div className="account-tabs">
            {tabs.map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`account-tab ${tab === id ? "is-active" : ""}`}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <section className="card-container !max-w-none">
                <h2 className="mb-4 font-mono text-xs uppercase tracking-widest">Plan details</h2>
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-army-light">Status</dt>
                    <dd className="uppercase">{sub.status}</dd>
                  </div>
                  <div>
                    <dt className="text-army-light">Receipt</dt>
                    <dd className="font-mono">{sub.receiptCode}</dd>
                  </div>
                  <div>
                    <dt className="text-army-light">Started</dt>
                    <dd>{sub.startsAt?.slice(0, 10) || sub.paidAt?.slice(0, 10) || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-army-light">Payment ref</dt>
                    <dd className="font-mono text-xs">{sub.reference}</dd>
                  </div>
                </dl>
                <p className="mt-5 text-sm text-army-light">
                  Submit mixes in-app with a stem link. Every request is stored and tracked here —
                  no separate email workflow required for logging the job.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" className="btn-primary !w-auto px-6" onClick={() => setTab("submit")}>
                    <span>{canSubmit ? "Submit a mix" : "Track limit reached"}</span>
                  </button>
                  <button type="button" className="nav-link" onClick={() => setTab("tracks")}>
                    View track history
                  </button>
                </div>
              </section>

              <section className="card-container !max-w-none text-center">
                <h2 className="font-army text-xl uppercase leading-tight sm:text-2xl">
                  Talk to the lead engineer
                </h2>
                <a href={`tel:${LEAD_PHONE.replace(/\s/g, "")}`} className="phone-link mt-4">
                  {LEAD_PHONE}
                </a>
                <p className="mt-2 text-xs text-army-light">Mid-Side Ent · Mixing & mastering</p>
              </section>
            </div>
          )}

          {tab === "submit" && (
            <section className="card-container !max-w-none">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-mono text-xs uppercase tracking-widest">
                    {editingId ? "Update mix request" : "Submit a mix"}
                  </h2>
                  <p className="mt-2 text-sm text-army-light">
                    Paste a Drive / Dropbox / WeTransfer link for stems. The request is saved to your
                    account and counted against your plan.
                  </p>
                </div>
                {editingId && (
                  <button type="button" className="nav-link !text-xs" onClick={resetForm}>
                    Cancel edit
                  </button>
                )}
              </div>

              {!canSubmit && !editingId ? (
                <p className="error-text">
                  Track limit reached for {sub.planName}. Wait for renewal or upgrade.
                </p>
              ) : (
                <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
                  <label className="flex flex-col gap-2 sm:col-span-2">
                    <span className="subtitle !text-[9px]">Track title *</span>
                    <input
                      className="input-name"
                      value={form.title}
                      onChange={(e) => setField("title", e.target.value)}
                      required
                      minLength={2}
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="subtitle !text-[9px]">Artist name</span>
                    <input
                      className="input-name"
                      value={form.artistName}
                      onChange={(e) => setField("artistName", e.target.value)}
                      placeholder={user?.fullName || "Artist"}
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="subtitle !text-[9px]">Genre</span>
                    <input
                      className="input-name"
                      value={form.genre}
                      onChange={(e) => setField("genre", e.target.value)}
                      placeholder="Afrobeats, Amapiano…"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="subtitle !text-[9px]">BPM</span>
                    <input
                      className="input-name"
                      value={form.bpm}
                      onChange={(e) => setField("bpm", e.target.value)}
                      placeholder="112"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="subtitle !text-[9px]">Key</span>
                    <input
                      className="input-name"
                      value={form.musicalKey}
                      onChange={(e) => setField("musicalKey", e.target.value)}
                      placeholder="Am / F#m"
                    />
                  </label>
                  <label className="flex flex-col gap-2 sm:col-span-2">
                    <span className="subtitle !text-[9px]">Stem link *</span>
                    <input
                      className="input-name"
                      type="url"
                      value={form.stemLink}
                      onChange={(e) => setField("stemLink", e.target.value)}
                      placeholder="https://drive.google.com/…"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 sm:col-span-2">
                    <span className="subtitle !text-[9px]">Reference links</span>
                    <input
                      className="input-name"
                      value={form.referenceLinks}
                      onChange={(e) => setField("referenceLinks", e.target.value)}
                      placeholder="Spotify / YouTube references"
                    />
                  </label>
                  <label className="flex flex-col gap-2 sm:col-span-2">
                    <span className="subtitle !text-[9px]">Notes for engineer</span>
                    <textarea
                      className="input-name min-h-28 resize-y"
                      value={form.notes}
                      onChange={(e) => setField("notes", e.target.value)}
                      placeholder="Vocal up, leave space for ad-libs, reference loudness…"
                    />
                  </label>

                  {error && <p className="error-text sm:col-span-2">{error}</p>}
                  {success && <p className="text-sm text-green-400 sm:col-span-2">{success}</p>}

                  <button className="btn-primary sm:col-span-2" type="submit" disabled={loading}>
                    <span>
                      {loading
                        ? "Saving…"
                        : editingId
                          ? "Save mix updates"
                          : "Submit mix to Mid-Side"}
                    </span>
                  </button>
                </form>
              )}
            </section>
          )}

          {tab === "tracks" && (
            <section className="flex flex-col gap-5">
              <div className="flex flex-wrap gap-2">
                {[
                  ["all", `All (${counts.all})`],
                  ["submitted", `Submitted (${counts.submitted})`],
                  ["in_progress", `In progress (${counts.in_progress})`],
                  ["revision", `Revision (${counts.revision})`],
                  ["delivered", `Delivered (${counts.delivered})`],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    className={`account-chip ${statusFilter === id ? "is-active" : ""}`}
                    onClick={() => setStatusFilter(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {filteredMixes.length === 0 ? (
                <div className="card-container !max-w-none text-center">
                  <p className="text-army-light">No mixes in this filter yet.</p>
                  <button type="button" className="btn-primary mx-auto mt-5 max-w-xs" onClick={() => setTab("submit")}>
                    <span>Submit your first mix</span>
                  </button>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {filteredMixes.map((mix) => {
                    const open = expandedId === mix.id;
                    const editable = ["submitted", "revision"].includes(mix.status);
                    return (
                      <li key={mix.id} className="card-container !max-w-none !gap-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="subtitle !text-[9px] mb-1">{mix.createdAt?.slice(0, 10)}</p>
                            <h3 className="font-army text-2xl uppercase leading-none">{mix.title}</h3>
                            <p className="mt-2 text-sm text-army-light">
                              {[mix.artistName, mix.genre, mix.bpm ? `${mix.bpm} BPM` : null, mix.musicalKey]
                                .filter(Boolean)
                                .join(" · ") || "No metadata yet"}
                            </p>
                          </div>
                          <span className={`mix-status mix-status--${mix.status}`}>
                            {STATUS_COPY[mix.status] || mix.status}
                          </span>
                        </div>

                        <StatusPipeline status={mix.status} />

                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            className="nav-link !text-xs"
                            onClick={() => setExpandedId(open ? null : mix.id)}
                          >
                            {open ? "Hide details" : "View details"}
                          </button>
                          {editable && (
                            <button type="button" className="nav-link !text-xs" onClick={() => startEdit(mix)}>
                              Edit submission
                            </button>
                          )}
                        </div>

                        {open && (
                          <div className="mix-detail-grid">
                            <div>
                              <p className="subtitle !text-[9px] mb-1">Stem link</p>
                              {mix.stemLink ? (
                                <a
                                  href={mix.stemLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="break-all text-sm text-tactical-amber underline"
                                >
                                  {mix.stemLink}
                                </a>
                              ) : (
                                <p className="text-sm text-army-light">Not provided</p>
                              )}
                            </div>
                            <div>
                              <p className="subtitle !text-[9px] mb-1">References</p>
                              <p className="text-sm whitespace-pre-wrap">{mix.referenceLinks || "—"}</p>
                            </div>
                            <div>
                              <p className="subtitle !text-[9px] mb-1">Your notes</p>
                              <p className="text-sm whitespace-pre-wrap">{mix.notes || "—"}</p>
                            </div>
                            <div>
                              <p className="subtitle !text-[9px] mb-1">Engineer notes</p>
                              <p className="text-sm whitespace-pre-wrap">{mix.adminNotes || "No notes yet"}</p>
                            </div>
                            <div>
                              <p className="subtitle !text-[9px] mb-1">Revisions used</p>
                              <p className="text-sm">{mix.revisionCount} / 2</p>
                            </div>
                            <div>
                              <p className="subtitle !text-[9px] mb-1">Last update</p>
                              <p className="text-sm">{mix.updatedAt?.slice(0, 16)?.replace("T", " ") || "—"}</p>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
