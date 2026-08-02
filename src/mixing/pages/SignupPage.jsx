import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../lib/api.js";
import { saveSession } from "../lib/subscription.js";

export default function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await signupUser(email, fullName);
      saveSession({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        termsAccepted: false,
      });
      navigate("/mixing/terms");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-8">
      <div className="text-center">
        <p className="subtitle mb-3">Artist mixing services</p>
        <h1 className="hero-heading">Subscribe to mixing &amp; mastering</h1>
        <p className="mt-4 text-sm leading-relaxed text-army-light sm:text-base">
          Create your account, agree to our terms, pick a plan, and pay securely with Paystack.
        </p>
      </div>

      <div className="card-container mx-auto w-full">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <label className="flex flex-col gap-2">
            <span className="subtitle !text-[10px]">Full name</span>
            <input
              className="input-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="As it should appear on your receipt"
              autoComplete="name"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="subtitle !text-[10px]">Email address</span>
            <input
              className="input-name"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Stems must be sent from this email"
              autoComplete="email"
              required
            />
            <span className="text-xs text-army-light">All mixing stems must be sent from this same email.</span>
          </label>

          {error && <p className="error-text">{error}</p>}

          <button className="btn-primary" type="submit" disabled={loading}>
            <span>{loading ? "Continuing…" : "Continue to terms"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
