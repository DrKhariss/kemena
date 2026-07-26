import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { acceptTerms } from "../lib/api.js";
import { loadSession, saveSession, TERMS_PARAGRAPHS } from "../lib/subscription.js";

export default function TermsPage() {
  const navigate = useNavigate();
  const session = loadSession();
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!agreed) {
      setError("You must agree to the terms to continue.");
      return;
    }

    setLoading(true);
    try {
      await acceptTerms(session.email);
      saveSession({ ...session, termsAccepted: true });
      navigate("/mixing/plans");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <div className="text-center">
        <p className="subtitle mb-3">Legal agreement</p>
        <h1 className="hero-heading text-3xl sm:text-4xl">Terms &amp; conditions</h1>
        <p className="mt-4 text-sm text-army-light sm:text-base">
          Please read carefully. You must agree before choosing a subscription plan.
        </p>
      </div>

      <div className="card-container mx-auto w-full max-w-2xl">
        <p className="mb-4 border-b border-white/10 pb-4 text-sm text-army-light">
          Subscriber: <strong className="text-white">{session.fullName}</strong>
        </p>

        <div className="terms-scroll mb-6">
          {TERMS_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <form className="border-t border-white/10 pt-5" onSubmit={handleSubmit}>
          <label className="checkbox-row mb-5">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>
              I, <strong>{session.fullName}</strong>, have read and agree to the terms and conditions above.
            </span>
          </label>

          {error && <p className="error-text mb-4">{error}</p>}

          <button className="btn-primary" type="submit" disabled={!agreed || loading}>
            <span>{loading ? "Processing…" : "Agree & choose a plan"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
