import { useState } from "react";
import { Link } from "react-router-dom";
import { createMixRequest } from "../lib/api.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { formatNgn } from "../lib/subscription.js";

const STEMS_EMAIL = import.meta.env.VITE_STEMS_EMAIL || "stems@example.com";
const LEAD_PHONE = import.meta.env.VITE_LEAD_ENGINEER_PHONE || "+234 800 000 0000";

export default function AccountPage() {
  const { user, account, refresh, logout } = useAuth();
  const sub = account?.activeSubscription;
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleMixRequest(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await createMixRequest(title, notes);
      setTitle("");
      setNotes("");
      setSuccess("Mix request logged. Send stems from your signup email.");
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="subtitle mb-3">Your account</p>
          <h1 className="hero-heading text-3xl sm:text-4xl">Welcome, {user?.fullName}</h1>
          <p className="mt-2 text-sm text-army-light">{user?.email}</p>
        </div>
        <button type="button" className="nav-link" onClick={logout}>
          Log out
        </button>
      </div>

      {!sub ? (
        <div className="card-container mx-auto w-full text-center">
          <p className="text-army-light">No active subscription yet.</p>
          <Link to="/mixing" className="btn-primary mt-6 inline-block max-w-xs">
            <span>Subscribe now</span>
          </Link>
        </div>
      ) : (
        <>
          <div className="card-container mx-auto w-full max-w-3xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="subtitle !text-[9px]">Active plan</p>
                <h2 className="font-army text-2xl uppercase">{sub.planName}</h2>
              </div>
              <span className="receipt-status">{sub.status}</span>
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-army-light">Receipt</dt><dd className="font-mono">{sub.receiptCode}</dd></div>
              <div><dt className="text-army-light">Amount</dt><dd>{formatNgn(sub.amountNgn)}</dd></div>
              <div><dt className="text-army-light">Tracks used</dt><dd>{sub.tracksUsed}{sub.tracksAllowed != null ? ` / ${sub.tracksAllowed}` : " (unlimited)"}</dd></div>
              <div><dt className="text-army-light">Tracks remaining</dt><dd>{sub.tracksRemaining}</dd></div>
              <div><dt className="text-army-light">Valid until</dt><dd>{sub.expiresAt?.slice(0, 10) || "—"}</dd></div>
              <div><dt className="text-army-light">Reference</dt><dd className="font-mono text-xs">{sub.reference}</dd></div>
            </dl>
          </div>

          <div className="card-container mx-auto w-full max-w-3xl">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest">Log a mix request</h3>
            <p className="mb-4 text-sm text-army-light">
              Log each track here, then email stems to <strong className="text-white">{STEMS_EMAIL}</strong> from{" "}
              <strong className="text-white">{user.email}</strong>.
            </p>
            <form className="flex flex-col gap-4" onSubmit={handleMixRequest}>
              <input
                className="input-name"
                placeholder="Track title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                className="input-name min-h-24 resize-y"
                placeholder="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              {error && <p className="error-text">{error}</p>}
              {success && <p className="text-sm text-green-400">{success}</p>}
              <button className="btn-primary" type="submit" disabled={loading}>
                <span>{loading ? "Submitting…" : "Log mix request"}</span>
              </button>
            </form>
          </div>

          {account?.mixRequests?.length > 0 && (
            <div className="card-container mx-auto w-full max-w-3xl">
              <h3 className="mb-4 font-mono text-xs uppercase tracking-widest">Your mix requests</h3>
              <ul className="divide-y divide-white/10 text-sm">
                {account.mixRequests.map((item) => (
                  <li key={item.id} className="flex justify-between gap-4 py-3">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-army-light">{item.created_at?.slice(0, 10)}</p>
                    </div>
                    <span className="font-mono text-xs uppercase text-tactical-amber">{item.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card-container mx-auto w-full max-w-3xl text-center">
            <h2 className="font-army text-xl uppercase">Talk to the lead engineer</h2>
            <a href={`tel:${LEAD_PHONE.replace(/\s/g, "")}`} className="phone-link mt-3">
              {LEAD_PHONE}
            </a>
          </div>
        </>
      )}
    </div>
  );
}
