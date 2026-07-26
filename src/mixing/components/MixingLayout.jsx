import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

const STEPS = [
  { id: "signup", label: "Sign up" },
  { id: "terms", label: "Terms" },
  { id: "plans", label: "Plan" },
  { id: "receipt", label: "Receipt" },
];

function stepIndex(pathname) {
  if (pathname.startsWith("/mixing/receipt")) return 3;
  if (pathname.startsWith("/mixing/plans")) return 2;
  if (pathname.startsWith("/mixing/terms")) return 1;
  if (
    pathname.startsWith("/mixing/login") ||
    pathname.startsWith("/mixing/account") ||
    pathname.startsWith("/mixing/admin") ||
    pathname.startsWith("/mixing/setup-password")
  ) {
    return -1;
  }
  if (pathname === "/mixing" || pathname === "/mixing/") return 0;
  return 0;
}

export default function MixingLayout() {
  const { pathname } = useLocation();
  const active = stepIndex(pathname);
  const showSteps = active >= 0;
  const { user } = useAuth();

  return (
    <div className="mixing-shell min-h-[calc(100vh-80px)]">
      <header className="no-print flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-4 py-5 sm:px-8">
        <div className="flex flex-col gap-1">
          <Link to="/" className="nav-link">
            ← Back to Kemena
          </Link>
          <Link to="/mixing" className="logo-text">
            Mid-Side Ent
          </Link>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-4">
            {user ? (
              user.role === "admin" ? (
                <Link to="/mixing/admin" className="nav-link">
                  Dashboard
                </Link>
              ) : (
                <Link to="/mixing/account" className="nav-link">
                  My account
                </Link>
              )
            ) : (
              <Link to="/mixing/login" className="nav-link">
                Log in
              </Link>
            )}
          </div>
          {showSteps && (
            <nav className="steps" aria-label="Progress">
              {STEPS.map((step, index) => (
                <span key={step.id} className="flex items-center gap-2">
                  {index > 0 && <span className="step-divider" />}
                  <span className={index === active ? "step active" : "step"}>{step.label}</span>
                </span>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8 sm:py-14">
        <Outlet />
      </main>

      <footer className="no-print border-t border-white/10 px-4 py-8 text-center text-sm text-army-light">
        Stereo mixing &amp; mastering · Radio &amp; streaming ready
      </footer>
    </div>
  );
}
