import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../lib/api.js";
import { saveSession } from "../lib/subscription.js";
import { youtubeEmbedSrc } from "../lib/youtube.js";

const INTRO_EMBED = youtubeEmbedSrc(import.meta.env.VITE_MIXING_INTRO_YOUTUBE_URL || "");

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

      {INTRO_EMBED && (
        <div className="w-full">
          <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-white/10 bg-black">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={INTRO_EMBED}
              title="Mid-Side Audio — watch before you sign up"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <p className="mt-3 text-center text-xs text-army-light sm:text-sm">
            Watch this short explainer before you sign up.
          </p>
        </div>
      )}

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
              placeholder="We'll use this for your account"
              autoComplete="email"
              required
            />
            <span className="text-xs text-army-light">
              Use this email for login. After you subscribe, submit stem links from your account
              dashboard.
            </span>
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
