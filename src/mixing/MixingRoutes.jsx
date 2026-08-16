import { Navigate, Route, Routes } from "react-router-dom";
import MixingLayout from "./components/MixingLayout.jsx";
import { RedirectIfAuthed, RequireAuth } from "./components/RequireAuth.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import PlansPage from "./pages/PlansPage.jsx";
import ReceiptPage from "./pages/ReceiptPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SetupPasswordPage from "./pages/SetupPasswordPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import { loadSession } from "./lib/subscription.js";
import "./mixing.css";

function RequireSession({ children }) {
  const session = loadSession();
  if (!session?.email) {
    return <Navigate to="/mixing" replace />;
  }
  return children;
}

function RequireTerms({ children }) {
  const session = loadSession();
  if (!session?.termsAccepted) {
    return <Navigate to="/mixing/terms" replace />;
  }
  return children;
}

export default function MixingRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MixingLayout />}>
          <Route
            index
            element={
              <RedirectIfAuthed>
                <SignupPage />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="login"
            element={
              <RedirectIfAuthed>
                <LoginPage />
              </RedirectIfAuthed>
            }
          />
          <Route path="setup-password" element={<SetupPasswordPage />} />
          <Route
            path="account"
            element={
              <RequireAuth>
                <AccountPage />
              </RequireAuth>
            }
          />
          <Route
            path="admin"
            element={
              <RequireAuth adminOnly>
                <AdminDashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path="terms"
            element={
              <RequireSession>
                <TermsPage />
              </RequireSession>
            }
          />
          <Route
            path="plans"
            element={
              <RequireSession>
                <RequireTerms>
                  <PlansPage />
                </RequireTerms>
              </RequireSession>
            }
          />
          <Route path="receipt" element={<ReceiptPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
