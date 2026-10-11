import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchReceipt } from "../lib/api.js";
import { formatNgn } from "../lib/subscription.js";

const LEAD_PHONE = import.meta.env.VITE_LEAD_ENGINEER_PHONE || "+234 800 000 0000";
const WHATSAPP_DIGITS = String(import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/\D/g, "");
const WHATSAPP_HREF = WHATSAPP_DIGITS ? `https://wa.me/${WHATSAPP_DIGITS}` : null;
const STEMS_EMAIL = import.meta.env.VITE_STEMS_EMAIL || "stems@example.com";

export default function ReceiptPage() {
  const [params] = useSearchParams();
  const reference = params.get("reference");
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reference) {
      setError("No receipt reference provided.");
      setLoading(false);
      return;
    }

    fetchReceipt(reference)
      .then(setReceipt)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [reference]);

  if (loading) {
    return <p className="text-center text-army-light">Loading receipt…</p>;
  }

  if (error || !receipt) {
    return (
      <div className="card-container mx-auto text-center">
        <h1 className="hero-heading mb-4 text-2xl">Receipt unavailable</h1>
        <p className="mb-6 text-army-light">{error || "Could not load receipt."}</p>
        <Link to="/mixing" className="nav-link justify-center">
          Start over
        </Link>
      </div>
    );
  }

  const setupHref = `/mixing/setup-password?email=${encodeURIComponent(receipt.email)}&reference=${encodeURIComponent(receipt.reference)}`;
  const needsPassword = !receipt.hasPassword;

  return (
    <div className="receipt-page mx-auto flex max-w-xl flex-col gap-5">
      <div className="text-center">
        <p className="subtitle mb-3">Payment confirmed</p>
        <h1 className="hero-heading text-3xl sm:text-4xl">Thank you, {receipt.fullName}!</h1>
        <p className="mt-3 text-sm text-army-light">
          Your <strong className="text-white">{receipt.planName}</strong> plan is active
          {receipt.demo ? " (demo)" : ""}.
        </p>
      </div>

      {/* Primary action first — visible above the fold on mobile */}
      <section className="receipt-action" aria-labelledby="receipt-next-action">
        <p className="subtitle !text-[9px] !tracking-[0.18em]">Required next</p>
        <h2 id="receipt-next-action" className="receipt-action__title">
          {needsPassword ? "Create your account password" : "Open your account"}
        </h2>
        <p className="receipt-action__copy">
          {needsPassword
            ? "You need a password before you can log in and submit mixes."
            : "Submit mixes in-app with a Drive / Dropbox / WeTransfer stem link."}
        </p>
        <div className="receipt-action__buttons">
          {needsPassword ? (
            <Link to={setupHref} className="btn-primary btn-primary--accent no-underline">
              <span>Create account password</span>
            </Link>
          ) : (
            <>
              <Link to="/mixing/account" className="btn-primary btn-primary--accent no-underline">
                <span>Go to account</span>
              </Link>
              <Link to="/mixing/login" className="btn-primary no-underline">
                <span>Log in</span>
              </Link>
            </>
          )}
        </div>
      </section>

      <div className="card-container mx-auto w-full">
        <div className="mb-5 flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="subtitle !text-[9px]">Receipt</p>
            <p className="font-mono text-xl font-bold tracking-wide">{receipt.receiptCode}</p>
          </div>
          <span className="receipt-status">{receipt.demo ? "Paid (demo)" : "Paid"}</span>
        </div>

        <dl className="space-y-3 text-sm">
          {[
            ["Email", receipt.email],
            ["Plan", receipt.planName],
            ["Tracks", receipt.tracks],
            ["Duration", receipt.duration],
            ["Amount paid", formatNgn(receipt.amountNgn)],
            ["Payment reference", receipt.reference],
            ["Date", receipt.paidAt?.slice(0, 10) || "—"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 border-b border-white/5 pb-2">
              <dt className="text-army-light">{label}</dt>
              <dd className="break-all text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 border-t border-white/10 pt-4 text-sm text-army-light">
          <h3 className="mb-2 font-mono text-xs uppercase tracking-widest text-white">After you sign in</h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Submit mixes from your account with a stem link. Include receipt{" "}
              <strong className="text-white">{receipt.receiptCode}</strong> in notes if helpful.
            </li>
            <li>
              Optional support: <strong className="text-white">{STEMS_EMAIL}</strong>
            </li>
            <li>Maximum of two revisions per mix.</li>
          </ul>
        </div>
      </div>

      <section className="receipt-support" aria-label="Contact support">
        <p className="subtitle !text-[9px]">Need help?</p>
        <p className="receipt-support__title">Talk to the lead engineer</p>
        <a href={`tel:${LEAD_PHONE.replace(/\s/g, "")}`} className="phone-link receipt-support__phone">
          {LEAD_PHONE}
        </a>
        {WHATSAPP_HREF && (
          <a
            href={WHATSAPP_HREF}
            className="btn-primary receipt-support__wa no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Talk to Kemena on WhatsApp</span>
          </a>
        )}
        <p className="mt-1 text-xs text-army-light">Lead Engineer · Mid-Side Audio</p>
      </section>

      <button type="button" className="receipt-print no-print" onClick={() => window.print()}>
        Print receipt
      </button>
    </div>
  );
}
