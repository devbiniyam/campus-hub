import { useState, useEffect } from "react";
import { apiFetch } from "./api";

const S = {
  wrap: { animation: "fadeUp .4s ease both" },
  banner: {
    background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)",
    border: "1px solid #a7f3d0",
    borderRadius: "16px",
    padding: "1.75rem",
    marginBottom: "1.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "1.25rem",
    boxShadow: "0 4px 20px rgba(5, 150, 105, 0.08)",
  },
  greeting: { fontSize: "13px", color: "#047857", marginBottom: "4px", fontWeight: "600" },
  name: { fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" },
  staffBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#ffffff",
    border: "1px solid #6ee7b7",
    borderRadius: "20px",
    padding: "5px 14px",
    fontSize: "12px",
    color: "#059669",
    fontWeight: "700",
    boxShadow: "0 1px 4px rgba(5, 150, 105, 0.08)",
  },
  idBox: {
    background: "#ffffff",
    border: "1px solid #a7f3d0",
    borderRadius: "12px",
    padding: "10px 18px",
    textAlign: "right",
    boxShadow: "0 2px 8px rgba(5, 150, 105, 0.06)",
  },
  idLabel: { fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "700" },
  idValue: { fontSize: "14px", fontWeight: "800", color: "#059669", marginTop: "2px" },
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
    marginBottom: "12px",
  },
  courseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "14px",
    marginBottom: "1.5rem",
  },
  courseCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "1.25rem",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
    transition: "transform 0.15s ease",
  },
  courseName: { fontSize: "15px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" },
  courseMeta: { fontSize: "12px", color: "#64748b", marginBottom: "10px" },
  pill: {
    display: "inline-block",
    fontSize: "11px",
    padding: "3px 10px",
    borderRadius: "20px",
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    color: "#047857",
    fontWeight: "600",
  },
  changeCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    overflow: "hidden",
    marginBottom: "1.5rem",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
  },
  changeRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #f1f5f9",
    flexWrap: "wrap",
    gap: "8px",
  },
  changeLeft: { fontSize: "13px", color: "#0f172a", fontWeight: "600" },
  changeSub: { fontSize: "11px", color: "#64748b", marginTop: "2px" },
  pendingBadge: {
    fontSize: "11px",
    padding: "4px 10px",
    borderRadius: "20px",
    fontWeight: "600",
  },
  empty: { padding: "2.5rem", textAlign: "center", fontSize: "13px", color: "#64748b" },
  loading: { padding: "3rem", textAlign: "center", fontSize: "14px", color: "#64748b" },
};

export default function TeacherDashboard({ user }) {
  const [assignments, setAssignments] = useState([]);
  const [changeRequests, setChangeRequests] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [aRes, cRes, eRes, pRes] = await Promise.all([
          apiFetch("/course-assignments/"),
          apiFetch("/grade-change-requests/"),
          apiFetch("/enrollments/"),
          apiFetch("/users/me/"),
        ]);
        if (aRes.ok) setAssignments(await aRes.json());
        if (cRes.ok) setChangeRequests(await cRes.json());
        if (eRes.ok) setEnrollments(await eRes.json());
        if (pRes.ok) setProfile(await pRes.json());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div style={S.loading}>Loading faculty dashboard…</div>;

  const pending = changeRequests.filter((r) => r.status === "PENDING");
  const totalStudents = new Set(enrollments.map((e) => e.student)).size;

  return (
    <div style={S.wrap}>
      <div style={S.banner}>
        <div>
          <div style={S.greeting}>Welcome back,</div>
          <div style={S.name}>
            {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user?.username} 👨‍🏫
          </div>
          <div style={S.staffBadge}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
            {profile?.department_name || "Computer Science Department"}
          </div>
        </div>
        <div style={S.idBox}>
          <div style={S.idLabel}>Faculty Staff ID</div>
          <div style={S.idValue}>{profile?.staff_id || "FAC-CS-001"}</div>
          <div style={{ ...S.idLabel, marginTop: "8px" }}>Role</div>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#34d399" }}>Faculty Teacher</div>
        </div>
      </div>

      <div style={S.statsRow}>
        {[
          { label: "Assigned Courses", value: assignments.length, sub: "Active Semester", color: "#059669" },
          { label: "Enrolled Students", value: totalStudents || 1, sub: "Across all courses", color: "#0284c7" },
          { label: "Grade Change Requests", value: pending.length, sub: "Pending Dean review", color: pending.length > 0 ? "#d97706" : "#64748b" },
        ].map((s) => (
          <div key={s.label} style={{ ...S.statCard, borderTop: `3px solid ${s.color}` }}>
            <div style={{ ...S.statValue, color: s.color }}>{s.value}</div>
            <div style={S.statLabel}>{s.label}</div>
            <div style={S.statSub}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <div style={S.sectionHead}>Active Course Teaching Roster</div>
        {assignments.length === 0 ? (
          <div style={{ ...S.courseCard, textAlign: "center" }}>
            <div style={S.empty}>No course assignments found for this semester.</div>
          </div>
        ) : (
          <div style={S.courseGrid}>
            {assignments.map((a) => {
              const count = enrollments.filter((e) => e.course === a.course).length;
              return (
                <div key={a.id} style={S.courseCard}>
                  <div style={S.courseName}>{a.course_name || `Course #${a.course}`}</div>
                  <div style={S.courseMeta}>
                    {a.course_code || ""} • {a.teaching_role || "Primary Lecturer"}
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={S.pill}>{count || 1} student{count !== 1 ? "s" : ""} enrolled</span>
                    <span style={{ ...S.pill, background: "#f0f9ff", borderColor: "#bae6fd", color: "#0284c7" }}>
                      {a.semester_name || "Fall 2026/27"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <div style={S.sectionHead}>Grade Change Audit Requests</div>
        <div style={S.changeCard}>
          {changeRequests.length === 0 ? (
            <div style={S.empty}>No recent grade change requests. Grades submitted are final unless revised.</div>
          ) : (
            changeRequests.slice(0, 5).map((r) => (
              <div key={r.id} style={S.changeRow}>
                <div>
                  <div style={S.changeLeft}>Enrollment #{r.enrollment}</div>
                  <div style={S.changeSub}>
                    Revision: {r.old_grade} → {r.new_grade} • {r.reason?.slice(0, 60) || "Routine correction"}
                  </div>
                </div>
                <span
                  style={{
                    ...S.pendingBadge,
                    background:
                      r.status === "APPROVED"
                        ? "#ecfdf5"
                        : r.status === "REJECTED"
                        ? "#fef2f2"
                        : "#fffbeb",
                    border: `1px solid ${
                      r.status === "APPROVED"
                        ? "#a7f3d0"
                        : r.status === "REJECTED"
                        ? "#fecaca"
                        : "#fde68a"
                    }`,
                    color:
                      r.status === "APPROVED"
                        ? "#059669"
                        : r.status === "REJECTED"
                        ? "#dc2626"
                        : "#d97706",
                  }}
                >
                  {r.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
