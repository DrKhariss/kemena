import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchConfig, initiatePayment, openPaystack, verifyPayment } from "../lib/api.js";
import { formatNgn, loadSession, PLANS } from "../lib/subscription.js";

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
    <div className="flex flex-col gap-10">
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.values(PLANS).map((plan) => (
          <article
            key={plan.id}
            className={`plan-card ${plan.badge === "Popular" ? "featured" : ""}`}
          >
            {plan.badge && <span className="plan-badge">{plan.badge}</span>}
            <h2 className="font-army text-2xl font-black uppercase tracking-tight">{plan.name}</h2>
            <p className="mt-2 font-mono text-xl font-bold text-tactical-amber">{formatNgn(plan.priceNgn)}</p>
            <ul className="my-5 flex-1 space-y-2 border-t border-white/10 pt-4 text-sm text-army-light">
              <li>
                <strong className="text-white">{plan.tracks}</strong>{" "}
                {plan.tracks === "Unlimited" || plan.tracks === "3 per month" ? "" : "tracks"}
              </li>
              <li>{plan.duration}</li>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <button
              type="button"
              className="btn-primary"
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
