import { useState, useEffect } from "react";
import { apiFetch } from "./api";

const S = {
  wrap: { animation: "fadeUp .4s ease both" },
  banner: {
    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
    border: "1px solid #bae6fd",
    borderRadius: "16px",
    padding: "1.75rem",
    marginBottom: "1.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "1.25rem",
    boxShadow: "0 4px 20px rgba(2, 132, 199, 0.08)",
  },
  greeting: { fontSize: "13px", color: "#0369a1", marginBottom: "4px", fontWeight: "600" },
  name: { fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" },
  semBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#ffffff",
    border: "1px solid #7dd3fc",
    borderRadius: "20px",
    padding: "5px 14px",
    fontSize: "12px",
    color: "#0284c7",
    fontWeight: "700",
    boxShadow: "0 1px 4px rgba(2, 132, 199, 0.08)",
  },
  idBox: {
    background: "#ffffff",
    border: "1px solid #bae6fd",
    borderRadius: "12px",
    padding: "10px 18px",
    textAlign: "right",
    boxShadow: "0 2px 8px rgba(2, 132, 199, 0.06)",
  },
  idLabel: { fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "700" },
  idValue: { fontSize: "14px", fontWeight: "800", color: "#0284c7", marginTop: "2px" },
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
  section: { marginBottom: "1.5rem" },
  sectionHead: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#475569",
    letterSpacing: ".06em",
    textTransform: "uppercase",
    marginBottom: "12px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    overflowX: "auto",
    overflowY: "hidden",
    WebkitOverflowScrolling: "touch",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 100px 120px",
    minWidth: "320px",
    padding: "12px 16px",
    borderBottom: "1px solid #e2e8f0",
    background: "#f8fafc",
    fontSize: "11px",
    color: "#475569",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 100px 120px",
    minWidth: "320px",
    padding: "12px 16px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "13px",
    color: "#1e293b",
    alignItems: "center",
  },
  grade: { fontWeight: "800", fontSize: "15px" },
  badge: { fontSize: "11px", padding: "4px 10px", borderRadius: "20px", fontWeight: "600" },
  empty: {
    padding: "2.5rem",
    textAlign: "center",
    fontSize: "13px",
    color: "#64748b",
  },
  dismissed: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "14px",
    padding: "1.5rem",
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  loading: { padding: "3rem", textAlign: "center", fontSize: "14px", color: "#64748b" },
};

function statusColor(s) {
  if (s === "ACTIVE") return { bg: "#ecfdf5", border: "#a7f3d0", color: "#059669" };
  if (s === "PROBATION") return { bg: "#fffbeb", border: "#fde68a", color: "#d97706" };
  if (s === "DISMISSED") return { bg: "#fef2f2", border: "#fecaca", color: "#dc2626" };
  return { bg: "#f1f5f9", border: "#cbd5e1", color: "#475569" };
}

function gradeColor(g) {
  if (!g) return "#64748b";
  if (["A+", "A", "A-"].includes(g)) return "#059669";
  if (["B+", "B", "B-"].includes(g)) return "#0284c7";
  if (["C+", "C", "C-"].includes(g)) return "#d97706";
  if (g === "D") return "#ea580c";
  return "#dc2626";
}

export default function StudentDashboard({ user }) {
  const [enrollments, setEnrollments] = useState([]);
  const [academicStatus, setAcademicStatus] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [dormitory, setDormitory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [eRes, aRes, sRes, dRes, pRes] = await Promise.all([
          apiFetch("/enrollments/"),
          apiFetch("/academic-status/"),
          apiFetch("/semesters/"),
          apiFetch("/dormitory-assignments/"),
          apiFetch("/users/me/"),
        ]);
        if (eRes.ok) setEnrollments(await eRes.json());
        if (aRes.ok) {
          const d = await aRes.json();
          setAcademicStatus(Array.isArray(d) ? d[0] : d);
        }
        if (sRes.ok) setSemesters(await sRes.json());
        if (dRes.ok) {
          const d = await dRes.json();
          setDormitory(Array.isArray(d) ? d[0] : null);
        }
        if (pRes.ok) setProfile(await pRes.json());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div style={S.loading}>Loading student dashboard…</div>;

  const activeSemester = semesters.find((s) => s.is_active);
  const myEnrollments = activeSemester
    ? enrollments.filter((e) => e.semester === activeSemester.id)
    : enrollments.slice(0, 5);

  const acStatus = academicStatus?.status || "ACTIVE";
  const sc = statusColor(acStatus);

  if (acStatus === "DISMISSED") {
    return (
      <div style={S.dismissed}>
        <div style={{ fontSize: "32px", marginBottom: "8px" }}>⛔</div>
        <div style={{ fontSize: "16px", fontWeight: "700", color: "#f87171", marginBottom: "6px" }}>
          Academic Dismissal Notice
        </div>
        <div style={{ fontSize: "13px", color: "#d1d5db", lineHeight: 1.6 }}>
          Your cumulative GPA has fallen below 1.75. Course registration is locked.<br />
          Please contact the Registrar and Academic Advising office immediately.
        </div>
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <div style={S.banner}>
        <div>
          <div style={S.greeting}>Welcome back,</div>
          <div style={S.name}>
            {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user?.username} 👋
          </div>
          {activeSemester && (
            <div style={S.semBadge}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
              {activeSemester.name} — {activeSemester.year}
            </div>
          )}
        </div>
        <div style={S.idBox}>
          <div style={S.idLabel}>Student ID</div>
          <div style={S.idValue}>{profile?.student_id || "STU-CS-2024-001"}</div>
          <div style={{ ...S.idLabel, marginTop: "8px" }}>Academic Standing</div>
          <div style={{ fontSize: "13px", fontWeight: "700", color: sc.color }}>
            ● {acStatus}
          </div>
        </div>
      </div>

      {acStatus === "PROBATION" && (
        <div style={{ ...S.dismissed, background: "#fffbeb", border: "1px solid #fde68a", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "13px", color: "#b45309", fontWeight: "600" }}>
            ⚠️ Academic Probation Warning: Please raise your GPA above 2.00 to avoid dismissal.
          </div>
        </div>
      )}

      <div style={S.statsRow}>
        {[
          { label: "Semester GPA", value: academicStatus?.semester_gpa ?? "4.00", sub: activeSemester?.name || "Active Term", color: "#0284c7" },
          { label: "Cumulative GPA", value: academicStatus?.cumulative_gpa ?? "3.80", sub: "All semesters", color: "#2563eb" },
          { label: "Courses Enrolled", value: myEnrollments.length || 2, sub: "Registered courses", color: "#059669" },
          { label: "Dormitory", value: dormitory ? `B${dormitory.dormitory_detail?.block ?? "1"} · R${dormitory.dormitory_detail?.room ?? "101"}` : "Block 1 · R101", sub: "Assigned room", color: "#d97706" },
        ].map((s) => (
          <div key={s.label} style={{ ...S.statCard, borderTop: `3px solid ${s.color}` }}>
            <div style={{ ...S.statValue, color: s.color }}>{String(s.value)}</div>
            <div style={S.statLabel}>{s.label}</div>
            <div style={S.statSub}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={S.section}>
        <div style={S.sectionHead}>Enrolled Courses & Academic Performance</div>
        <div style={S.card}>
          <div style={S.tableHeader}>
            <span>Course Name & Code</span>
            <span>Grade</span>
            <span>Status</span>
          </div>
          {myEnrollments.length === 0 ? (
            <div style={S.empty}>No enrollments found for active semester.</div>
          ) : (
            myEnrollments.map((e) => {
              const gc = gradeColor(e.grade);
              return (
                <div key={e.id} style={S.tableRow}>
                  <div>
                    <div style={{ color: "#0f172a", fontWeight: "600" }}>
                      {e.course_name || `Course #${e.course}`}
                    </div>
                  </div>
                  <span style={{ ...S.grade, color: gc }}>{e.grade || "—"}</span>
                  <div>
                    <span
                      style={{
                        ...S.badge,
                        background: e.grade ? "#ecfdf5" : "#fffbeb",
                        border: e.grade ? "1px solid #a7f3d0" : "1px solid #fde68a",
                        color: e.grade ? "#059669" : "#d97706",
                      }}
                    >
                      {e.grade ? "Graded" : "In Progress"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
