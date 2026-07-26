import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { setupPassword } from "../lib/api.js";
import { useAuth } from "../hooks/useAuth.jsx";

export default function SetupPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const email = params.get("email") || "";
  const reference = params.get("reference") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await setupPassword(email, password, reference);
      await refresh();
      navigate("/mixing/account");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-8">
      <div className="text-center">
        <p className="subtitle mb-3">Account access</p>
        <h1 className="hero-heading text-3xl sm:text-4xl">Create your password</h1>
        <p className="mt-4 text-sm text-army-light">
          Set a password to log in anytime and manage your mixing subscription.
        </p>
      </div>

      <div className="card-container mx-auto w-full">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2">
            <span className="subtitle !text-[10px]">Email</span>
            <input className="input-name" type="email" value={email} readOnly />
          </label>
          <label className="flex flex-col gap-2">
            <span className="subtitle !text-[10px]">Password</span>
            <input
              className="input-name"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="subtitle !text-[10px]">Confirm password</span>
            <input
              className="input-name"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="btn-primary" type="submit" disabled={loading}>
            <span>{loading ? "Saving…" : "Save & go to account"}</span>
          </button>
        </form>
        <p className="mt-5 text-center text-xs text-army-light">
          Already set up? <Link to="/mixing/login" className="text-tactical-amber">Log in</Link>
        </p>
      </div>
    </div>
  );
}
