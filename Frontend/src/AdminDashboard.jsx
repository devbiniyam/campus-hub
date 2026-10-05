import { useState, useEffect } from "react";
import { apiFetch } from "./api";

const S = {
  wrap: { animation: "fadeUp .4s ease both" },
  banner: {
    background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
    border: "1px solid #fde68a",
    borderRadius: "16px",
    padding: "1.75rem",
    marginBottom: "1.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "1.25rem",
    boxShadow: "0 4px 20px rgba(217, 119, 6, 0.08)",
  },
  greeting: { fontSize: "13px", color: "#b45309", marginBottom: "4px", fontWeight: "600" },
  name: { fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" },
  adminBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#ffffff",
    border: "1px solid #fcd34d",
    borderRadius: "20px",
    padding: "5px 14px",
    fontSize: "12px",
    color: "#b45309",
    fontWeight: "700",
    boxShadow: "0 1px 4px rgba(217, 119, 6, 0.08)",
  },
  idBox: {
    background: "#ffffff",
    border: "1px solid #fde68a",
    borderRadius: "12px",
    padding: "10px 18px",
    textAlign: "right",
    boxShadow: "0 2px 8px rgba(217, 119, 6, 0.06)",
  },
  idLabel: { fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "700" },
  idValue: { fontSize: "14px", fontWeight: "800", color: "#b45309", marginTop: "2px" },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    marginBottom: "1.5rem",
  },
  statCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "1.25rem",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
  },
  statValue: { fontSize: "28px", fontWeight: "800", marginBottom: "4px", letterSpacing: "-0.5px" },
  statLabel: { fontSize: "13px", color: "#334155", fontWeight: "600" },
  statSub: { fontSize: "11px", color: "#64748b", marginTop: "2px" },
  sectionHead: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#475569",
    letterSpacing: ".06em",
    textTransform: "uppercase",
  },
  tableCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    overflow: "hidden",
    marginBottom: "1.5rem",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
  },
  tableHeader: {
    display: "grid",
    padding: "12px 16px",
    borderBottom: "1px solid #e2e8f0",
    background: "#f8fafc",
    fontSize: "11px",
    color: "#475569",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  tableRow: {
    display: "grid",
    padding: "12px 16px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "13px",
    color: "#1e293b",
    alignItems: "center",
  },
  actionBtn: {
    fontSize: "11px",
    padding: "6px 14px",
    borderRadius: "8px",
    border: "1px solid",
    cursor: "pointer",
    fontWeight: "600",
    background: "transparent",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.15s ease",
  },
  empty: { padding: "2.5rem", textAlign: "center", fontSize: "13px", color: "#64748b" },
  loading: { padding: "3rem", textAlign: "center", fontSize: "14px", color: "#64748b" },
};

export default function AdminDashboard({ user }) {
  const [registrations, setRegistrations] = useState([]);
  const [gradeChanges, setGradeChanges]   = useState([]);
  const [users, setUsers]                 = useState([]);
  const [departments, setDepartments]     = useState([]);
  const [semesters, setSemesters]         = useState([]);
  const [profile, setProfile]             = useState(null);
  const [loading, setLoading]             = useState(true);
  const [toast, setToast]                 = useState({ msg: "", isError: false });

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast({ msg: "", isError: false }), 4000);
  };

  const loadAll = async () => {
    try {
      const [rRes, gRes, uRes, dRes, sRes, pRes] = await Promise.all([
        apiFetch("/registrations/"),
        apiFetch("/grade-change-requests/"),
        apiFetch("/users/"),
        apiFetch("/departments/"),
        apiFetch("/semesters/"),
        apiFetch("/users/me/"),
      ]);
      if (rRes.ok) setRegistrations(await rRes.json());
      if (gRes.ok) setGradeChanges(await gRes.json());
      if (uRes.ok) setUsers(await uRes.json());
      if (dRes.ok) setDepartments(await dRes.json());
      if (sRes.ok) setSemesters(await sRes.json());
      if (pRes.ok) setProfile(await pRes.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const handleAction = async (url, id, action, setter) => {
    const res  = await apiFetch(`${url}${id}/${action}/`, { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      const newStatus = action === "approve" ? "APPROVED" : "REJECTED";
      setter(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      showToast(`${action === "approve" ? "Approved" : "Rejected"} successfully`);
    } else {
      showToast(`Error: ${data?.error || data?.detail || JSON.stringify(data)}`, true);
    }
  };

  const pending       = registrations.filter(r => r.status === "PENDING");
  const pendingGrades = gradeChanges.filter(r => r.status === "PENDING");
  const activeSem     = semesters.find(s => s.is_active);
  const students      = users.filter(u => u.role === "STUDENT");
  const teachers      = users.filter(u => u.role === "TEACHER");

  if (loading) return <div style={S.loading}>Loading administration panel…</div>;

  return (
    <div style={S.wrap}>
      {toast.msg && (
        <div style={{
          position: "fixed", bottom: "24px", right: "24px",
          borderRadius: "12px", padding: "12px 20px", fontSize: "13px", zIndex: 100,
          background: toast.isError ? "#fef2f2" : "#ecfdf5",
          border: `1px solid ${toast.isError ? "#fecaca" : "#a7f3d0"}`,
          color: toast.isError ? "#991b1b" : "#065f46",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
          fontWeight: "700",
        }}>
          {toast.isError ? "⚠️" : "✓"} {toast.msg}
        </div>
      )}

      {/* Banner */}
      <div style={S.banner}>
        <div>
          <div style={S.greeting}>Dean / Registrar Overview</div>
          <div style={S.name}>
            {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user?.username} 🛡️
          </div>
          <div style={S.adminBadge}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#d97706", display: "inline-block" }} />
            System Administrator & Registrar
          </div>
        </div>
        <div style={S.idBox}>
          <div style={S.idLabel}>Active Academic Term</div>
          <div style={S.idValue}>
            {activeSem ? `${activeSem.name} (${activeSem.year})` : "None active"}
          </div>
          <div style={{ ...S.idLabel, marginTop: "8px" }}>Academic Departments</div>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#d97706", marginTop: "2px" }}>
            {departments.length || 4} Departments
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={S.statsRow}>
        {[
          { label: "Enrolled Students", value: students.length || 2, sub: "Registered accounts", color: "#0284c7" },
          { label: "Faculty Professors", value: teachers.length || 1, sub: "Active academic staff", color: "#059669" },
          { label: "Pending Registrations", value: pending.length, sub: "Action required", color: pending.length > 0 ? "#d97706" : "#64748b" },
          { label: "Grade Change Tickets", value: pendingGrades.length, sub: "Needs Dean review", color: pendingGrades.length > 0 ? "#7c3aed" : "#64748b" },
        ].map(s => (
          <div key={s.label} style={{ ...S.statCard, borderTop: `3px solid ${s.color}` }}>
            <div style={{ ...S.statValue, color: s.color }}>{s.value}</div>
            <div style={S.statLabel}>{s.label}</div>
            <div style={S.statSub}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Pending registrations */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div style={S.sectionHead}>Pending Student Course Registrations</div>
          <button onClick={loadAll}
            style={{ fontSize: "12px", padding: "6px 14px", borderRadius: "20px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#334155", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: "600", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            ↻ Refresh Requests
          </button>
        </div>
        <div style={S.tableCard}>
          <div style={{ ...S.tableHeader, gridTemplateColumns: "1fr 140px 180px" }}>
            <span>Student Candidate</span><span>Term</span><span>Approval Actions</span>
          </div>
          {pending.length === 0
            ? <div style={S.empty}>No pending registrations. All student requests approved! ✓</div>
            : pending.map(r => (
                <div key={r.id} style={{ ...S.tableRow, gridTemplateColumns: "1fr 140px 180px" }}>
                  <span style={{ color: "#0f172a", fontWeight: "600" }}>Student #{r.student}</span>
                  <span style={{ color: "#64748b" }}>Term #{r.semester}</span>
                  <span style={{ display: "flex", gap: "8px" }}>
                    <button style={{ ...S.actionBtn, borderColor: "#a7f3d0", color: "#059669", background: "#ecfdf5" }}
                      onClick={() => handleAction("/registrations/", r.id, "approve", setRegistrations)}>
                      Approve & Enroll
                    </button>
                    <button style={{ ...S.actionBtn, borderColor: "#fecaca", color: "#dc2626", background: "#fef2f2" }}
                      onClick={() => handleAction("/registrations/", r.id, "reject", setRegistrations)}>
                      Reject
                    </button>
                  </span>
                </div>
              ))
          }
        </div>
      </div>

      {/* Pending grade changes */}
      <div>
        <div style={{ ...S.sectionHead, marginBottom: "12px" }}>Faculty Grade Change Requests</div>
        <div style={S.tableCard}>
          <div style={{ ...S.tableHeader, gridTemplateColumns: "1fr 120px 140px 180px" }}>
            <span>Enrollment Ticket</span><span>Revision</span><span>Reason</span><span>Actions</span>
          </div>
          {pendingGrades.length === 0
            ? <div style={S.empty}>No pending grade changes. System grades are consistent and locked! ✓</div>
            : pendingGrades.map(r => (
                <div key={r.id} style={{ ...S.tableRow, gridTemplateColumns: "1fr 120px 140px 180px" }}>
                  <span style={{ color: "#0f172a", fontWeight: "600" }}>Enrollment #{r.enrollment}</span>
                  <span style={{ color: "#d97706", fontWeight: "700" }}>{r.old_grade} → {r.new_grade}</span>
                  <span style={{ color: "#64748b", fontSize: "12px" }}>{r.reason?.slice(0, 30) || "Routine correction"}…</span>
                  <span style={{ display: "flex", gap: "8px" }}>
                    <button style={{ ...S.actionBtn, borderColor: "#a7f3d0", color: "#059669", background: "#ecfdf5" }}
                      onClick={() => handleAction("/grade-change-requests/", r.id, "approve", setGradeChanges)}>
                      Approve
                    </button>
                    <button style={{ ...S.actionBtn, borderColor: "#fecaca", color: "#dc2626", background: "#fef2f2" }}
                      onClick={() => handleAction("/grade-change-requests/", r.id, "reject", setGradeChanges)}>
                      Reject
                    </button>
                  </span>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}