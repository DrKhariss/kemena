import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchConfig, initiatePayment, openPaystack, verifyPayment } from "../lib/api.js";
import { formatNgn, loadSession, PLANS } from "../lib/subscription.js";

function TrackLines({ plan }) {
  if (plan.stereoTracks == null && plan.atmosTracks == null) {
    return (
      <>
        <li>
          <strong className="text-white">Unlimited</strong> stereo mixes
        </li>
        <li>
          <strong className="text-white">Dolby Atmos</strong> included
        </li>
      </>
    );
  }

  return (
    <>
      <li>
        <strong className="text-white">{plan.stereoTracks}</strong> stereo track
        {plan.stereoTracks === 1 ? "" : "s"}
      </li>
      {plan.atmosTracks > 0 ? (
        <li>
          <strong className="text-white">{plan.atmosTracks}</strong> Dolby Atmos track
          {plan.atmosTracks === 1 ? "" : "s"}
        </li>
      ) : (
        <li className="plan-card__muted">No Dolby Atmos on this plan</li>
      )}
    </>
  );
}

export default function PlansPage() {
  const navigate = useNavigate();
  const session = loadSession();
  const [error, setError] = useState("");
  const [payingPlan, setPayingPlan] = useState(null);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    fetchConfig()
      .then((config) => setDemoMode(!config.paystackConfigured))
      .catch(() => {});
  }, []);

  function goToReceipt(verified) {
    navigate(
      `/mixing/receipt?reference=${encodeURIComponent(verified.reference)}&code=${encodeURIComponent(verified.receiptCode)}`,
    );
  }

  async function handlePay(planId) {
    setError("");
    setPayingPlan(planId);

    try {
      const payment = await initiatePayment(planId, session);

      if (payment.demo) {
        const verified = await verifyPayment(payment.reference);
        goToReceipt(verified);
        return;
      }

      openPaystack({
        publicKey: payment.publicKey,
        email: payment.email,
        amountKobo: payment.amountKobo,
        reference: payment.reference,
        planId,
        planName: payment.planName,
        fullName: session.fullName,
        onSuccess: async (reference) => {
          try {
            goToReceipt(await verifyPayment(reference));
          } catch (err) {
            setError(err.message);
            setPayingPlan(null);
          }
        },
        onClose: () => setPayingPlan(null),
      });
    } catch (err) {
      setError(err.message);
      setPayingPlan(null);
    }
  }

  return (
    <div className="plans-page flex flex-col gap-10">
      <div className="text-center">
        <p className="subtitle mb-3">Subscription plans</p>
        <h1 className="hero-heading text-3xl sm:text-5xl">Pick your plan</h1>
        <p className="mt-4 text-sm text-army-light sm:text-base">
          Signed in as <strong className="text-white">{session.email}</strong>. Payment via Paystack.
        </p>
        {demoMode && (
          <p className="mt-4 text-xs uppercase tracking-widest text-tactical-amber">
            Demo mode · Paystack keys not set, so no card is charged
          </p>
        )}
      </div>

      <div className="plans-grid">
        {Object.values(PLANS).map((plan) => (
          <article
            key={plan.id}
            className={`plan-card ${plan.highlight ? "plan-card--highlight" : ""} ${
              plan.badge === "Popular" ? "featured" : ""
            }`}
          >
            {plan.badge && <span className="plan-badge">{plan.badge}</span>}
            <p className="plan-card__duration">{plan.duration}</p>
            <h2 className="plan-card__name">{plan.name}</h2>
            <p className="plan-card__price">
              {formatNgn(plan.priceNgn)}
              <span>{plan.id === "basic" ? " / month" : ` / ${plan.duration}`}</span>
            </p>

            <ul className="plan-card__list">
              <TrackLines plan={plan} />
              {plan.id === "platinum" && <li>Best for labels with multiple artistes</li>}
              {plan.id === "basic" && <li>Flexible entry point</li>}
            </ul>

            <button
              type="button"
              className={`btn-primary ${plan.highlight || plan.badge === "Popular" ? "btn-primary--accent" : ""}`}
              disabled={payingPlan !== null}
              onClick={() => handlePay(plan.id)}
            >
              <span>
                {payingPlan === plan.id
                  ? demoMode
                    ? "Completing…"
                    : "Opening payment…"
                  : "Pay with Paystack"}
              </span>
            </button>
          </article>
        ))}
      </div>

      {error && <p className="error-text text-center">{error}</p>}
    </div>
  );
}
