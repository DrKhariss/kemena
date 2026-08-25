import { useEffect, useMemo, useState } from "react";
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

const STATUS_COPY = {
  submitted: "Queued",
  in_progress: "On desk",
  revision: "Revision",
  delivered: "Delivered",
};

const STATUS_ORDER = ["submitted", "in_progress", "revision", "delivered"];

function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function relativeDay(iso) {
  if (!iso) return "—";
  const day = iso.slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  if (day === today) return "Today";
  return day;
}

function QueueBoard({ mixRequests, onOpen }) {
  const columns = STATUS_ORDER.map((status) => ({
    status,
    items: mixRequests.filter((mix) => mix.status === status),
  }));

  return (
    <div className="admin-board">
      {columns.map((column, index) => (
        <section
          key={column.status}
          className="admin-board__col"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <header className="admin-board__head">
            <span className={`admin-dot admin-dot--${column.status}`} />
            <h3>{STATUS_COPY[column.status]}</h3>
            <span className="admin-board__count">{column.items.length}</span>
          </header>
          <ul className="admin-board__list">
            {column.items.length === 0 && (
              <li className="admin-board__empty">Quiet lane</li>
            )}
            {column.items.slice(0, 5).map((mix) => (
              <li key={mix.id}>
                <button type="button" className="admin-board__card" onClick={() => onOpen(mix.id)}>
                  <strong>{mix.title}</strong>
                  <span>{mix.fullName || mix.artistName || "Artist"}</span>
                  <em>{relativeDay(mix.createdAt)}</em>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [mixRequests, setMixRequests] = useState([]);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview");
  const [mixFilter, setMixFilter] = useState("all");
  const [focusMixId, setFocusMixId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clock, setClock] = useState(() => new Date());

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
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    const tick = setInterval(() => setClock(new Date()), 30_000);
    return () => clearInterval(tick);
  }, []);

  async function handleMixStatus(id, status, adminNotes) {
    await updateAdminMixRequest(id, status, adminNotes);
    await loadAll();
  }

  async function handleSubStatus(id, status) {
    await updateAdminSubscription(id, { status });
    await loadAll();
  }

  const filteredMixes = useMemo(() => {
    if (mixFilter === "all") return mixRequests;
    return mixRequests.filter((mix) => mix.status === mixFilter);
  }, [mixRequests, mixFilter]);

  const openJobs = mixRequests.filter((m) =>
    ["submitted", "in_progress", "revision"].includes(m.status),
  ).length;

  const tabs = [
    ["overview", "Desk", stats ? String(openJobs) : "—"],
    ["mixes", "Sessions", String(mixRequests.length)],
    ["subscribers", "Artists", String(subscribers.length)],
    ["subscriptions", "Plans", String(subscriptions.length)],
  ];

  function openMix(id) {
    setTab("mixes");
    setMixFilter("all");
    setFocusMixId(id);
    requestAnimationFrame(() => {
      document.getElementById(`mix-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  return (
    <div className="admin-desk">
      <header className="admin-hero">
        <div className="admin-hero__glow" aria-hidden="true" />
        <div className="admin-hero__grid" aria-hidden="true" />
        <div className="admin-hero__copy">
          <p className="admin-kicker">
            <span className="admin-live" /> Mid-Side Audio · Session desk
          </p>
          <h1 className="admin-title">
            Control
            <span>deck</span>
          </h1>
          <p className="admin-lede">
            Queue stems, move sessions, and keep every subscriber plan in earshot.
          </p>
        </div>
        <aside className="admin-hero__meta">
          <div className="admin-meta-chip">
            <span>Operator</span>
            <strong>{user?.fullName || user?.email || "Admin"}</strong>
          </div>
          <div className="admin-meta-chip">
            <span>Local time</span>
            <strong>
              {clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </strong>
          </div>
          <button type="button" className="admin-logout" onClick={logout}>
            Sign out
          </button>
        </aside>
      </header>

      <nav className="admin-rail" aria-label="Admin sections">
        {tabs.map(([id, label, count]) => (
          <button
            key={id}
            type="button"
            className={`admin-rail__btn ${tab === id ? "is-active" : ""}`}
            onClick={() => setTab(id)}
          >
            <span className="admin-rail__label">{label}</span>
            <span className="admin-rail__count">{count}</span>
          </button>
        ))}
      </nav>

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="admin-loading">Spinning up the desk…</p>}

      {tab === "overview" && stats && (
        <section className="admin-panel admin-panel--overview">
          <div className="admin-vu-grid">
            {[
              {
                label: "Subscribers",
                value: stats.subscribers,
                tone: "cyan",
                hint: "Signed up artists",
              },
              {
                label: "Active plans",
                value: stats.activeSubs,
                tone: "amber",
                hint: "Paying right now",
              },
              {
                label: "Desk revenue",
                value: formatNgn(stats.revenue),
                tone: "green",
                hint: "Active plan total",
              },
              {
                label: "Open mixes",
                value: stats.pendingMixes,
                tone: "red",
                hint: "Need engineer eyes",
              },
            ].map((stat, index) => (
              <article
                key={stat.label}
                className={`admin-vu admin-vu--${stat.tone}`}
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="admin-vu__bars" aria-hidden="true">
                  {Array.from({ length: 8 }).map((_, bar) => (
                    <i key={bar} style={{ animationDelay: `${bar * 90}ms` }} />
                  ))}
                </div>
                <p className="admin-vu__label">{stat.label}</p>
                <p className="admin-vu__value">{stat.value}</p>
                <p className="admin-vu__hint">{stat.hint}</p>
              </article>
            ))}
          </div>

          <div className="admin-split">
            <div>
              <div className="admin-section-head">
                <h2>Session board</h2>
                <button type="button" className="admin-text-btn" onClick={() => setTab("mixes")}>
                  Open full queue →
                </button>
              </div>
              <QueueBoard mixRequests={mixRequests} onOpen={openMix} />
            </div>

            <div className="admin-pulse-card">
              <h2>Tonight’s pulse</h2>
              <ul>
                <li>
                  <span>Waiting on stems desk</span>
                  <strong>{mixRequests.filter((m) => m.status === "submitted").length}</strong>
                </li>
                <li>
                  <span>Currently mixing</span>
                  <strong>{mixRequests.filter((m) => m.status === "in_progress").length}</strong>
                </li>
                <li>
                  <span>Artist revisions</span>
                  <strong>{mixRequests.filter((m) => m.status === "revision").length}</strong>
                </li>
                <li>
                  <span>Shipped</span>
                  <strong>{mixRequests.filter((m) => m.status === "delivered").length}</strong>
                </li>
              </ul>
              <button type="button" className="btn-primary mt-6" onClick={() => setTab("mixes")}>
                <span>Work the queue</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {tab === "subscribers" && (
        <section className="admin-panel">
          <div className="admin-section-head">
            <h2>Artist roster</h2>
            <p>{subscribers.length} accounts</p>
          </div>
          <div className="admin-roster">
            {subscribers.map((row, index) => (
              <article
                key={row.id}
                className="admin-roster__card"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="admin-avatar">{initials(row.full_name)}</div>
                <div>
                  <h3>{row.full_name}</h3>
                  <p>{row.email}</p>
                </div>
                <div className="admin-roster__meta">
                  <span className={row.active_plans ? "is-live" : ""}>
                    {row.active_plans ? `${row.active_plans} live` : "No plan"}
                  </span>
                  <span>{row.has_password ? "Password on" : "Needs password"}</span>
                  <span>{row.created_at?.slice(0, 10)}</span>
                </div>
              </article>
            ))}
            {subscribers.length === 0 && <p className="text-army-light">No subscribers yet.</p>}
          </div>
        </section>
      )}

      {tab === "subscriptions" && (
        <section className="admin-panel">
          <div className="admin-section-head">
            <h2>Plan ledger</h2>
            <p>{subscriptions.length} records</p>
          </div>
          <div className="admin-plan-grid">
            {subscriptions.map((row, index) => {
              const allowed = row.tracks_allowed;
              const used = row.tracks_used || 0;
              const pct =
                allowed == null ? 12 : Math.min(100, Math.round((used / Math.max(allowed, 1)) * 100));
              return (
                <article
                  key={row.id}
                  className={`admin-plan-card admin-plan-card--${row.status}`}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="admin-plan-card__top">
                    <div>
                      <p className="admin-kicker !mb-1">{row.plan_id}</p>
                      <h3>{row.full_name}</h3>
                      <p className="text-sm text-army-light">{row.email}</p>
                    </div>
                    <span className={`mix-status mix-status--${row.status === "active" ? "delivered" : "revision"}`}>
                      {row.status}
                    </span>
                  </div>
                  <div className="admin-plan-card__meter">
                    <div className="track-meter">
                      <span style={{ width: `${pct}%` }} />
                    </div>
                    <p>
                      {used}
                      {allowed != null ? ` / ${allowed}` : " · unlimited"} tracks · {row.receipt_code}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="admin-text-btn"
                    onClick={() =>
                      handleSubStatus(row.id, row.status === "active" ? "expired" : "active")
                    }
                  >
                    {row.status === "active" ? "Mark expired" : "Reactivate plan"}
                  </button>
                </article>
              );
            })}
            {subscriptions.length === 0 && <p className="text-army-light">No subscriptions yet.</p>}
          </div>
        </section>
      )}

      {tab === "mixes" && (
        <section className="admin-panel">
          <div className="admin-section-head">
            <h2>Mix sessions</h2>
            <div className="admin-chip-row">
              {[["all", "All"], ...STATUS_ORDER.map((s) => [s, STATUS_COPY[s]])].map(
                ([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    className={`account-chip ${mixFilter === id ? "is-active" : ""}`}
                    onClick={() => setMixFilter(id)}
                  >
                    {label}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="admin-sessions">
            {filteredMixes.map((row, index) => (
              <article
                key={row.id}
                id={`mix-${row.id}`}
                className={`admin-session ${focusMixId === row.id ? "is-focus" : ""}`}
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <div className="admin-session__rail" aria-hidden="true">
                  <span className={`admin-dot admin-dot--${row.status}`} />
                  <i />
                </div>

                <div className="admin-session__body">
                  <div className="admin-session__head">
                    <div>
                      <p className="admin-kicker !mb-2">
                        {relativeDay(row.createdAt)} · {row.planId || "plan"} · rev {row.revisionCount}/2
                      </p>
                      <h3>{row.title}</h3>
                      <p className="admin-session__sub">
                        {row.fullName} · {row.email}
                      </p>
                    </div>
                    <span className={`mix-status mix-status--${row.status}`}>
                      {STATUS_COPY[row.status] || row.status}
                    </span>
                  </div>

                  <div className="admin-session__tags">
                    {[row.artistName, row.genre, row.bpm && `${row.bpm} BPM`, row.musicalKey]
                      .filter(Boolean)
                      .map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                  </div>

                  <div className="admin-session__grid">
                    <div>
                      <p className="subtitle !text-[9px] mb-1">Stem pack</p>
                      {row.stemLink ? (
                        <a
                          href={row.stemLink}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-stem-link"
                        >
                          Open stems ↗
                        </a>
                      ) : (
                        <p className="text-sm text-army-light">No link</p>
                      )}
                    </div>
                    <div>
                      <p className="subtitle !text-[9px] mb-1">References</p>
                      <p className="text-sm whitespace-pre-wrap">{row.referenceLinks || "—"}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="subtitle !text-[9px] mb-1">Artist notes</p>
                      <p className="text-sm whitespace-pre-wrap">{row.notes || "—"}</p>
                    </div>
                  </div>

                  <div className="admin-session__controls">
                    <label className="flex flex-col gap-2 flex-1">
                      <span className="subtitle !text-[9px]">Engineer notes (visible to artist)</span>
                      <input
                        className="input-name"
                        defaultValue={row.adminNotes || ""}
                        key={`${row.id}-${row.adminNotes || ""}`}
                        placeholder="Delivery link, mix notes, revision ask…"
                        onBlur={(e) => {
                          if ((e.target.value || "") !== (row.adminNotes || "")) {
                            handleMixStatus(row.id, row.status, e.target.value);
                          }
                        }}
                      />
                    </label>
                    <label className="flex flex-col gap-2 min-w-[10rem]">
                      <span className="subtitle !text-[9px]">Move status</span>
                      <select
                        className="input-name !py-3 text-xs"
                        value={row.status}
                        onChange={(e) => handleMixStatus(row.id, e.target.value, row.adminNotes)}
                      >
                        {STATUS_ORDER.map((status) => (
                          <option key={status} value={status}>
                            {STATUS_COPY[status]}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              </article>
            ))}

            {filteredMixes.length === 0 && (
              <div className="admin-empty">
                <p>No sessions in this lane.</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
