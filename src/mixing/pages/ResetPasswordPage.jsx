import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../lib/api.js";
import { useAuth } from "../hooks/useAuth.jsx";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("Missing reset token. Request a new link.");
      return;
    }
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
      const data = await resetPassword(token, password);
      await refresh();
      navigate(data.user?.role === "admin" ? "/mixing/admin" : "/mixing/account");
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
        <h1 className="hero-heading text-3xl sm:text-4xl">Reset password</h1>
        <p className="mt-4 text-sm text-army-light">Choose a new password for your Mid-Side account.</p>
      </div>

      <div className="card-container mx-auto w-full">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2">
            <span className="subtitle !text-[10px]">New password</span>
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
          <button className="btn-primary" type="submit" disabled={loading || !token}>
            <span>{loading ? "Saving…" : "Save new password"}</span>
          </button>
        </form>
        <p className="mt-5 text-center text-xs text-army-light">
          Link expired?{" "}
          <Link to="/mixing/forgot-password" className="text-tactical-amber">
            Request another
          </Link>
        </p>
      </div>
    </div>
  );
}
