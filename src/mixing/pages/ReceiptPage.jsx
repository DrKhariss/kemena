import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchReceipt } from "../lib/api.js";
import { formatNgn } from "../lib/subscription.js";

const LEAD_PHONE = import.meta.env.VITE_LEAD_ENGINEER_PHONE || "+234 800 000 0000";
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

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div className="text-center">
        <p className="subtitle mb-3">Payment confirmed</p>
        <h1 className="hero-heading text-3xl sm:text-4xl">Thank you, {receipt.fullName}!</h1>
        <p className="mt-4 text-sm text-army-light">
          Your subscription is active. Use this page as your receipt for all mixing requests.
        </p>
      </div>

      <div className="card-container mx-auto w-full">
        <div className="mb-6 flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <p className="subtitle !text-[9px]">Receipt</p>
            <p className="font-mono text-xl font-bold tracking-wide">{receipt.receiptCode}</p>
          </div>
          <span className="receipt-status">{receipt.demo ? "Paid (demo)" : "Paid"}</span>
        </div>

        <dl className="space-y-3 text-sm">
          {[
            ["Name", receipt.fullName],
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
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 border-t border-white/10 pt-5 text-sm text-army-light">
          <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-white">Next steps</h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Create a password, then open your <strong className="text-white">account</strong> to submit mixes
              in-app with a stem link.
            </li>
            <li>
              Include receipt code <strong className="text-white">{receipt.receiptCode}</strong> if you email
              anything to <strong className="text-white">{STEMS_EMAIL}</strong>.
            </li>
            <li>Maximum of two revisions per mix.</li>
          </ul>
        </div>
      </div>

      <div className="card-container mx-auto w-full text-center">
        <h2 className="font-army text-xl uppercase leading-tight sm:text-2xl">
          For further enquiry, talk to the lead engineer himself!
        </h2>
        <a href={`tel:${LEAD_PHONE.replace(/\s/g, "")}`} className="phone-link mt-4">
          {LEAD_PHONE}
        </a>
        <p className="mt-2 text-xs text-army-light">Lead Engineer · Mid-Side Ent</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {!receipt.hasPassword ? (
          <Link
            to={`/mixing/setup-password?email=${encodeURIComponent(receipt.email)}&reference=${encodeURIComponent(receipt.reference)}`}
            className="btn-primary max-w-xs text-center no-underline"
          >
            <span>Create account password</span>
          </Link>
        ) : (
          <Link to="/mixing/login" className="btn-primary max-w-xs text-center no-underline">
            <span>Log in to your account</span>
          </Link>
        )}
        <Link to="/mixing/account" className="btn-primary max-w-xs text-center no-underline">
          <span>Go to account</span>
        </Link>
      </div>

      <button type="button" className="btn-primary no-print mx-auto max-w-xs" onClick={() => window.print()}>
        <span>Print receipt</span>
      </button>
    </div>
  );
}
