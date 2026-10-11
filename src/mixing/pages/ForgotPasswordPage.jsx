import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../lib/api.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setDone(true);
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
        <h1 className="hero-heading text-3xl sm:text-4xl">Forgot password</h1>
        <p className="mt-4 text-sm text-army-light">
          We’ll email a reset link if that address has an account.
        </p>
      </div>

      <div className="card-container mx-auto w-full">
        {done ? (
          <div className="flex flex-col gap-4 text-sm text-army-light">
            <p>If that email has an account, we sent a reset link. Check your inbox.</p>
            <Link to="/mixing/login" className="text-tactical-amber">
              Back to log in
            </Link>
          </div>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2">
              <span className="subtitle !text-[10px]">Email</span>
              <input
                className="input-name"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            {error && <p className="error-text">{error}</p>}
            <button className="btn-primary" type="submit" disabled={loading}>
              <span>{loading ? "Sending…" : "Send reset link"}</span>
            </button>
          </form>
        )}
        {!done && (
          <p className="mt-5 text-center text-xs text-army-light">
            Remembered it?{" "}
            <Link to="/mixing/login" className="text-tactical-amber">
              Log in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
