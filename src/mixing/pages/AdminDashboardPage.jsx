import { useEffect, useState } from "react";
import {
  fetchAdminMixRequests,
  fetchAdminStats,
  fetchAdminSubscribers,
  fetchAdminSubscriptions,
  updateAdminMixRequest,
  updateAdminSubscription,
} from "../lib/api.js";
import { formatNgn } from "../lib/subscription.js";
import { useAuth } from "../hooks/useAuth.jsx";

export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [mixRequests, setMixRequests] = useState([]);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview");

  async function loadAll() {
    try {
      const [statsData, subsData, subscrData, mixData] = await Promise.all([
        fetchAdminStats(),
        fetchAdminSubscribers(),
        fetchAdminSubscriptions(),
        fetchAdminMixRequests(),
      ]);
      setStats(statsData);
      setSubscribers(subsData.subscribers);
      setSubscriptions(subscrData.subscriptions);
      setMixRequests(mixData.mixRequests);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleMixStatus(id, status) {
    await updateAdminMixRequest(id, status);
    await loadAll();
  }

  async function handleSubStatus(id, status) {
    await updateAdminSubscription(id, { status });
    await loadAll();
  }

  const tabs = [
    ["overview", "Overview"],
    ["subscribers", "Subscribers"],
    ["subscriptions", "Subscriptions"],
    ["mixes", "Mix requests"],
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="subtitle mb-3">Mid-Side Ent</p>
          <h1 className="hero-heading text-3xl sm:text-5xl">Admin dashboard</h1>
        </div>
        <button type="button" className="nav-link" onClick={logout}>
          Log out
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider border ${
              tab === id ? "border-tactical-amber text-tactical-amber" : "border-white/10 text-army-light"
            }`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <p className="error-text">{error}</p>}

      {tab === "overview" && stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Subscribers", stats.subscribers],
            ["Active plans", stats.activeSubs],
            ["Revenue (NGN)", formatNgn(stats.revenue)],
            ["Open mix jobs", stats.pendingMixes],
          ].map(([label, value]) => (
            <div key={label} className="plan-card">
              <p className="subtitle !text-[9px]">{label}</p>
              <p className="mt-2 font-mono text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "subscribers" && (
        <div className="card-container max-w-6xl overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-army-light">
              <tr>
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Active plans</th>
                <th className="pb-3">Password</th>
                <th className="pb-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((row) => (
                <tr key={row.id} className="border-t border-white/10">
                  <td className="py-3">{row.full_name}</td>
                  <td className="py-3">{row.email}</td>
                  <td className="py-3">{row.active_plans}</td>
                  <td className="py-3">{row.has_password ? "Yes" : "No"}</td>
                  <td className="py-3">{row.created_at?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "subscriptions" && (
        <div className="card-container max-w-6xl overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-army-light">
              <tr>
                <th className="pb-3">Subscriber</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Tracks</th>
                <th className="pb-3">Receipt</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((row) => (
                <tr key={row.id} className="border-t border-white/10">
                  <td className="py-3">{row.full_name}<br /><span className="text-xs text-army-light">{row.email}</span></td>
                  <td className="py-3 uppercase">{row.plan_id}</td>
                  <td className="py-3">{row.status}</td>
                  <td className="py-3">{row.tracks_used}{row.tracks_allowed != null ? ` / ${row.tracks_allowed}` : ""}</td>
                  <td className="py-3 font-mono text-xs">{row.receipt_code}</td>
                  <td className="py-3">
                    {row.status === "active" ? (
                      <button type="button" className="nav-link !text-xs" onClick={() => handleSubStatus(row.id, "expired")}>
                        Mark expired
                      </button>
                    ) : (
                      <button type="button" className="nav-link !text-xs" onClick={() => handleSubStatus(row.id, "active")}>
                        Mark active
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "mixes" && (
        <div className="card-container max-w-6xl overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-army-light">
              <tr>
                <th className="pb-3">Track</th>
                <th className="pb-3">Artist</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Update</th>
              </tr>
            </thead>
            <tbody>
              {mixRequests.map((row) => (
                <tr key={row.id} className="border-t border-white/10">
                  <td className="py-3">{row.title}</td>
                  <td className="py-3">{row.full_name}<br /><span className="text-xs text-army-light">{row.email}</span></td>
                  <td className="py-3 uppercase">{row.plan_id}</td>
                  <td className="py-3">{row.status}</td>
                  <td className="py-3">
                    <select
                      className="input-name !py-2 text-xs"
                      value={row.status}
                      onChange={(e) => handleMixStatus(row.id, e.target.value)}
                    >
                      {["submitted", "in_progress", "delivered", "revision"].map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
