import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../lib/api.js";
import { useAuth } from "../hooks/useAuth.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      await refresh();
      navigate(data.user.role === "admin" ? "/mixing/admin" : "/mixing/account");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-8">
      <div className="text-center">
        <p className="subtitle mb-3">Subscriber portal</p>
        <h1 className="hero-heading text-3xl sm:text-4xl">Log in</h1>
        <p className="mt-4 text-sm text-army-light">
          Access your plan, receipt, and mix requests.
        </p>
      </div>

      <div className="card-container mx-auto w-full">
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
          {error && <p className="error-text">{error}</p>}
          <button className="btn-primary" type="submit" disabled={loading}>
            <span>{loading ? "Signing in…" : "Log in"}</span>
          </button>
        </form>
        <p className="mt-5 text-center text-xs text-army-light">
          New here? <Link to="/mixing" className="text-tactical-amber">Subscribe first</Link>
        </p>
      </div>
    </div>
  );
}
