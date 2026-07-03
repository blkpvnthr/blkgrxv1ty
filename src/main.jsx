import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Briefcase, Target, Rocket, Database, LineChart, User, Plus, CheckCircle2,
  ClipboardList, Pencil, Trash2, X, ExternalLink
} from "lucide-react";
import { launchWeeks, initialCompanies, projects as seedProjects } from "./seedData";
import { db, auth, provider } from "./firebase";
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, where
} from "firebase/firestore";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { LogIn, LogOut } from "lucide-react";
import "./styles.css";

const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const load = (key, fallback) => JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));

const APP_STATUSES = [
  "Applied",
  "Rejected",
  "Under Consideration",
  "Phone Call",
  "Interview",
  "Accepted"
];

function App() {
  const [activeSection, setActiveSection] = useState("roadmap");
  const [activeWeek, setActiveWeek] = useState(0);
  const [activeGoal, setActiveGoal] = useState(0);
  const [checks, setChecks] = useState(() => load("blk-checks", {}));
  const [companies, setCompanies] = useState(() => load("blk-companies", initialCompanies));
  const [newCompany, setNewCompany] = useState("");
  const [projects, setProjects] = useState(() => load("blk-projects", seedProjects));
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => onAuthStateChanged(auth, (u) => { setUser(u); setAuthReady(true); }), []);

  const signIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setAuthError(err?.message || String(err));
    }
  };

  const signOutUser = () => signOut(auth).catch((err) => setAuthError(err?.message || String(err)));

  const totals = useMemo(() => {
    let total = 0;
    let done = 0;
    launchWeeks.forEach((week, wi) => {
      week.goals.forEach((goal, gi) => {
        goal.tasks.forEach((_, ti) => {
          total += 1;
          if (checks[`w${wi}-g${gi}-t${ti}`]) done += 1;
        });
      });
    });
    return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
  }, [checks]);

  const toggleCheck = (key) => {
    const next = { ...checks, [key]: !checks[key] };
    setChecks(next);
    save("blk-checks", next);
  };

  const addCompany = () => {
    if (!newCompany.trim()) return;
    const next = [...companies, { company: newCompany.trim(), role: "Software Engineer", status: "Researching", priority: "Medium" }];
    setCompanies(next);
    save("blk-companies", next);
    setNewCompany("");
  };

  const updateCompany = (idx, field, value) => {
    const next = companies.map((item, i) => i === idx ? { ...item, [field]: value } : item);
    setCompanies(next);
    save("blk-companies", next);
  };

  const nav = [
    ["dashboard", "Dashboard", Target],
    ["roadmap", "Launch Roadmap", Rocket],
    ["jobs", "Job Tracker", Briefcase],
    ["applications", "Applications", ClipboardList],
    ["portfolio", "Portfolio", Database],
    ["capital", "Capital", LineChart],
    ["brand", "Personal Brand", User]
  ];

  return (
    <div className="shell">
      <header className="navbar">
        <div className="brand">
          <div className="planet" />
          <div>
            <span>Project</span>
            <h1>BLKGR4V1TY</h1>
          </div>
        </div>

        <nav className="navlinks">
          {nav.map(([id, label, Icon]) => (
            <button key={id} onClick={() => setActiveSection(id)} className={activeSection === id ? "active" : ""}>
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="nav-progress">
          <div className="bar"><div style={{ width: `${totals.percent}%` }} /></div>
          <small>{totals.percent}% · {totals.done}/{totals.total}</small>
        </div>

        <div className="nav-account">
          {!authReady ? (
            <span className="nav-user muted">…</span>
          ) : user ? (
            <>
              {user.photoURL && <img className="nav-avatar" src={user.photoURL} alt="" referrerPolicy="no-referrer" />}
              <span className="nav-user">{user.displayName || user.email}</span>
              <button className="account-btn" onClick={signOutUser} title="Sign out"><LogOut size={15} /></button>
            </>
          ) : (
            <button className="account-btn signin" onClick={signIn}><LogIn size={15} /> Sign in</button>
          )}
        </div>
      </header>

      {authError && (
        <div className="alert-banner">
          Sign-in error: {authError}
          <span className="alert-hint"> — ensure Google is enabled in Firebase Auth and this domain is authorized.</span>
        </div>
      )}

      <main className="content">
        {activeSection === "dashboard" && <Dashboard totals={totals} companies={companies} projects={projects} />}
        {activeSection === "roadmap" && (
          <Roadmap
            activeWeek={activeWeek}
            setActiveWeek={setActiveWeek}
            activeGoal={activeGoal}
            setActiveGoal={setActiveGoal}
            checks={checks}
            toggleCheck={toggleCheck}
          />
        )}
        {activeSection === "jobs" && (
          <Jobs companies={companies} updateCompany={updateCompany} newCompany={newCompany} setNewCompany={setNewCompany} addCompany={addCompany} />
        )}
        {activeSection === "applications" && <Applications user={user} authReady={authReady} signIn={signIn} />}
        {activeSection === "portfolio" && <Portfolio projects={projects} setProjects={setProjects} />}
        {activeSection === "capital" && <SimpleSection title="Capital Engine" subtitle="Track income, savings, investments, runway, and progress toward financial independence." items={["Current target: $250K/year", "Long-term target: $1M+/year ecosystem", "Focus: convert income into assets", "Next build: net worth and savings tracker"]} />}
        {activeSection === "brand" && <SimpleSection title="Personal Brand" subtitle="Make your engineering work visible and legible." items={["Update asmaa.dev", "Write project case studies", "Publish technical notes", "Show architecture diagrams", "Connect with recruiters and engineers"]} />}
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Project BLKGR4V1TY — Engineer a life that compounds.</span>
        <div className="footer-links">
          <a href="https://asmaa.dev" target="_blank" rel="noreferrer">asmaa.dev</a>
          <span className="dot">·</span>
          <span>Career · Product · Capital · Brand</span>
        </div>
      </footer>
    </div>
  );
}

function Dashboard({ totals, companies, projects }) {
  const cards = [
    ["Current Phase", "Launch Sequence"],
    ["Progress", `${totals.percent}%`],
    ["Target Income", "$250K → $1M"],
    ["Work Style", "Remote / Hybrid"]
  ];

  return (
    <section>
      <p className="eyebrow">Personal Operating System</p>
      <h2>Good morning, Asmaa.</h2>
      <p className="lede">Engineer a life that compounds: career, products, capital, and brand.</p>

      <div className="cards">
        {cards.map(([label, value]) => (
          <article className="stat" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>

      <div className="grid two">
        <article className="panel">
          <h3>Career Pipeline</h3>
          {companies.slice(0, 5).map((c) => (
            <div className="row" key={c.company}>
              <span>{c.company}</span>
              <em>{c.status}</em>
            </div>
          ))}
        </article>

        <article className="panel">
          <h3>Portfolio Assets</h3>
          {projects.map((p) => (
            <div className="row" key={p.name}>
              <span>{p.name}</span>
              <em>{p.score}/100</em>
            </div>
          ))}
        </article>
      </div>
    </section>
  );
}

function Roadmap({ activeWeek, setActiveWeek, activeGoal, setActiveGoal, checks, toggleCheck }) {
  const week = launchWeeks[activeWeek];
  const goal = week.goals[activeGoal];

  return (
    <section>
      <p className="eyebrow">Launch Roadmap</p>
      <h2>{week.title}: {week.theme}</h2>
      <p className="lede">{week.objective}</p>

      <div className="tabs">
        {launchWeeks.map((w, i) => (
          <button key={w.title} onClick={() => { setActiveWeek(i); setActiveGoal(0); }} className={i === activeWeek ? "selected" : ""}>{w.title}</button>
        ))}
      </div>

      <div className="tabs small">
        {week.goals.map((g, i) => (
          <button key={g.title} onClick={() => setActiveGoal(i)} className={i === activeGoal ? "selected" : ""}>{g.title}</button>
        ))}
      </div>

      <article className="panel">
        <h3>{goal.title}</h3>
        <p>{goal.why}</p>
        <div className="task-list">
          {goal.tasks.map((task, ti) => {
            const k = `w${activeWeek}-g${activeGoal}-t${ti}`;
            return (
              <label className="task" key={k}>
                <input type="checkbox" checked={!!checks[k]} onChange={() => toggleCheck(k)} />
                <span>{task}</span>
              </label>
            );
          })}
        </div>
      </article>
    </section>
  );
}

function Jobs({ companies, updateCompany, newCompany, setNewCompany, addCompany }) {
  return (
    <section>
      <p className="eyebrow">Career Engine</p>
      <h2>Job Tracker</h2>
      <p className="lede">Track target companies, roles, statuses, and priority.</p>

      <div className="add-row">
        <input value={newCompany} onChange={(e) => setNewCompany(e.target.value)} placeholder="Add company..." />
        <button onClick={addCompany}><Plus size={18}/> Add</button>
      </div>

      <article className="panel">
        <div className="table head">
          <strong>Company</strong><strong>Role</strong><strong>Status</strong><strong>Priority</strong>
        </div>
        {companies.map((c, i) => (
          <div className="table" key={`${c.company}-${i}`}>
            <input value={c.company} onChange={(e) => updateCompany(i, "company", e.target.value)} />
            <input value={c.role} onChange={(e) => updateCompany(i, "role", e.target.value)} />
            <select value={c.status} onChange={(e) => updateCompany(i, "status", e.target.value)}>
              <option>Researching</option>
              <option>Applied</option>
              <option>Recruiter Screen</option>
              <option>Technical Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
            <select value={c.priority} onChange={(e) => updateCompany(i, "priority", e.target.value)}>
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
        ))}
      </article>
    </section>
  );
}

const statusClass = (status) => "st-" + status.toLowerCase().replace(/\s+/g, "-");

const localNow = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const APPS_COLLECTION = "applications";
const APP_FIELDS = ["timestamp", "company", "position", "url", "salary", "status"];

const emptyApp = () => ({ timestamp: localNow(), company: "", position: "", url: "", salary: "", status: "Applied" });

// keep only the persisted fields (drops the Firestore doc id + any stray keys)
const toPayload = (form) => APP_FIELDS.reduce((acc, k) => ({ ...acc, [k]: form[k] ?? "" }), {});

function Applications({ user, authReady, signIn }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null); // null => new entry, else Firestore doc id
  const [form, setForm] = useState(emptyApp);
  const [localCount, setLocalCount] = useState(() => load("blk-applications", []).length);

  // Live subscription, scoped to the signed-in user's own docs. Sorted client-side
  // (by timestamp desc) so no composite Firestore index is required.
  useEffect(() => {
    if (!user) {
      setApplications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(collection(db, APPS_COLLECTION), where("uid", "==", user.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        rows.sort((a, b) => String(b.timestamp || "").localeCompare(String(a.timestamp || "")));
        setApplications(rows);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err?.message || String(err));
        setLoading(false);
      }
    );
    return unsub;
  }, [user]);

  const openNew = () => {
    setEditId(null);
    setForm(emptyApp());
    setModalOpen(true);
  };

  const openEdit = (a) => {
    setEditId(a.id);
    setForm({ ...emptyApp(), ...toPayload(a) });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!form.company.trim() && !form.position.trim()) return;
    setSaving(true);
    try {
      if (editId === null) {
        await addDoc(collection(db, APPS_COLLECTION), { ...toPayload(form), uid: user.uid, createdAt: Date.now() });
      } else {
        await updateDoc(doc(db, APPS_COLLECTION, editId), toPayload(form));
      }
      setModalOpen(false);
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (a) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await deleteDoc(doc(db, APPS_COLLECTION, a.id));
    } catch (err) {
      setError(err?.message || String(err));
    }
  };

  const setStatus = async (a, status) => {
    try {
      await updateDoc(doc(db, APPS_COLLECTION, a.id), { status });
    } catch (err) {
      setError(err?.message || String(err));
    }
  };

  // One-time importer for pre-Firestore localStorage entries.
  const importLocal = async () => {
    if (!user) return;
    const entries = load("blk-applications", []);
    if (!entries.length) return;
    setSaving(true);
    try {
      for (const entry of entries) {
        await addDoc(collection(db, APPS_COLLECTION), { ...toPayload({ ...emptyApp(), ...entry }), uid: user.uid, createdAt: Date.now() });
      }
      save("blk-applications", []); // clear local so we don't re-import
      setLocalCount(0);
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setSaving(false);
    }
  };

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const fmt = (ts) => {
    if (!ts) return "—";
    const d = new Date(ts);
    return Number.isNaN(d.getTime())
      ? ts
      : d.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  // Signed-out gate: Firestore rules require auth, so prompt for sign-in first.
  if (authReady && !user) {
    return (
      <section>
        <p className="eyebrow">Career Engine</p>
        <h2>Applications</h2>
        <p className="lede">Your applications are private and synced to your account.</p>
        <article className="panel signin-panel">
          <h3>Sign in to view your applications</h3>
          <p>Sign in with Google to load, add, and sync your job applications securely across devices.</p>
          <button className="primary" onClick={signIn}><LogIn size={18} /> Sign in with Google</button>
          {localCount > 0 && (
            <p className="signin-note">You have {localCount} saved locally — sign in to import {localCount === 1 ? "it" : "them"}.</p>
          )}
        </article>
      </section>
    );
  }

  return (
    <section>
      <p className="eyebrow">Career Engine</p>
      <h2>Applications</h2>
      <p className="lede">Log every application. Private to your account and synced live via Firestore.</p>

      <div className="add-row">
        <button className="primary" onClick={openNew}><Plus size={18}/> New Application</button>
        <span className="count-pill">{applications.length} total</span>
        {localCount > 0 && (
          <button className="ghost" onClick={importLocal} disabled={saving}>
            Import {localCount} local {localCount === 1 ? "entry" : "entries"}
          </button>
        )}
      </div>

      {error && (
        <div className="alert-banner">
          Firestore error: {error}
          <span className="alert-hint"> — check that Firestore is enabled and your Security Rules allow access.</span>
        </div>
      )}

      <article className="panel">
        <div className="dt-wrap">
          <table className="dt">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Company</th>
                <th>Position</th>
                <th>Salary Range</th>
                <th>URL</th>
                <th>Status</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="empty">Loading applications…</td></tr>
              )}
              {!loading && applications.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty">No applications yet. Click “New Application” to add your first entry.</td>
                </tr>
              )}
              {applications.map((a) => (
                <tr key={a.id}>
                  <td className="ts">{fmt(a.timestamp)}</td>
                  <td className="strong">{a.company || "—"}</td>
                  <td>{a.position || "—"}</td>
                  <td>{a.salary || "—"}</td>
                  <td className="url-cell">
                    {a.url ? (
                      <a href={a.url} target="_blank" rel="noreferrer">
                        Link <ExternalLink size={13} />
                      </a>
                    ) : "—"}
                  </td>
                  <td>
                    <select
                      className={`status-select ${statusClass(a.status)}`}
                      value={a.status}
                      onChange={(e) => setStatus(a, e.target.value)}
                    >
                      {APP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="actions-col">
                    <button className="icon-btn" title="Edit" onClick={() => openEdit(a)}><Pencil size={16} /></button>
                    <button className="icon-btn danger" title="Delete" onClick={() => remove(a)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editId === null ? "New Application" : "Edit Application"}</h3>
              <button className="icon-btn" onClick={closeModal} title="Close"><X size={18} /></button>
            </div>

            <form className="modal-form" onSubmit={submit}>
              <label>
                <span>Timestamp</span>
                <input
                  type="datetime-local"
                  value={form.timestamp}
                  onChange={(e) => setField("timestamp", e.target.value)}
                />
              </label>

              <label>
                <span>Company</span>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setField("company", e.target.value)}
                  placeholder="e.g. Jane Street"
                  autoFocus
                />
              </label>

              <label>
                <span>Position</span>
                <input
                  type="text"
                  value={form.position}
                  onChange={(e) => setField("position", e.target.value)}
                  placeholder="e.g. Quantitative Developer"
                />
              </label>

              <label>
                <span>Salary Range</span>
                <input
                  type="text"
                  value={form.salary}
                  onChange={(e) => setField("salary", e.target.value)}
                  placeholder="e.g. $150k – $200k"
                />
              </label>

              <label>
                <span>URL</span>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setField("url", e.target.value)}
                  placeholder="https://..."
                />
              </label>

              <label>
                <span>Status</span>
                <select
                  className={statusClass(form.status)}
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value)}
                >
                  {APP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>

              <div className="modal-actions">
                <button type="button" className="ghost" onClick={closeModal} disabled={saving}>Cancel</button>
                <button type="submit" className="primary" disabled={saving}>
                  {saving ? "Saving…" : editId === null ? "Add Application" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

function Portfolio({ projects, setProjects }) {
  const updateProject = (idx, field, value) => {
    const next = projects.map((p, i) => i === idx ? { ...p, [field]: field === "score" ? Number(value) : value } : p);
    setProjects(next);
    save("blk-projects", next);
  };

  return (
    <section>
      <p className="eyebrow">Product Engine</p>
      <h2>Portfolio Tracker</h2>
      <p className="lede">Turn projects into visible proof of engineering ability.</p>
      <div className="grid two">
        {projects.map((p, i) => (
          <article className="panel project" key={p.name}>
            <h3>{p.name}</h3>
            <input value={p.type} onChange={(e) => updateProject(i, "type", e.target.value)} />
            <input value={p.status} onChange={(e) => updateProject(i, "status", e.target.value)} />
            <label>Portfolio Score: {p.score}</label>
            <input type="range" min="0" max="100" value={p.score} onChange={(e) => updateProject(i, "score", e.target.value)} />
          </article>
        ))}
      </div>
    </section>
  );
}

function SimpleSection({ title, subtitle, items }) {
  return (
    <section>
      <p className="eyebrow">BLKGR4V1TY Pillar</p>
      <h2>{title}</h2>
      <p className="lede">{subtitle}</p>
      <article className="panel">
        {items.map((item) => (
          <div className="row" key={item}>
            <span><CheckCircle2 size={18}/> {item}</span>
          </div>
        ))}
      </article>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
