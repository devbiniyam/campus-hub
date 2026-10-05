import { useState, useEffect } from "react";
import { apiFetch } from "./api";

const S = {
  wrap: { animation: "fadeUp .4s ease both" },
  sectionHead: { fontSize: "11px", fontWeight: "700", color: "#475569", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "10px" },
  courseGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "10px", marginBottom: "1.5rem" },
  courseCard: {
    background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "12px",
    padding: "1rem", cursor: "pointer", transition: "all .15s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
  },
  courseCardActive: {
    borderColor: "#0284c7", background: "#f0f9ff",
    boxShadow: "0 0 0 1px #0284c7, 0 4px 12px rgba(2, 132, 199, 0.12)",
  },
  courseName: { fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" },
  courseMeta: { fontSize: "12px", color: "#64748b" },
  tableCard: {
    background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px",
    overflowX: "auto", overflowY: "hidden", WebkitOverflowScrolling: "touch",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
  },
  tableHeader: {
    display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 100px",
    minWidth: "440px",
    padding: "12px 14px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc",
    fontSize: "11px", color: "#475569", fontWeight: "700", textTransform: "uppercase",
  },
  tableRow: {
    display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 100px",
    minWidth: "440px",
    padding: "12px 14px", borderBottom: "1px solid #f1f5f9",
    fontSize: "13px", color: "#1e293b", alignItems: "center",
  },
  gpa: { fontWeight: "800" },
  statusBadge: (s) => ({
    fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: "700",
    background: s === "ACTIVE" ? "#ecfdf5" : s === "PROBATION" ? "#fffbeb" : "#fef2f2",
    border: `1px solid ${s === "ACTIVE" ? "#a7f3d0" : s === "PROBATION" ? "#fde68a" : "#fecaca"}`,
    color: s === "ACTIVE" ? "#059669" : s === "PROBATION" ? "#d97706" : "#dc2626",
  }),
  gradeColor: (g) => {
    if (!g) return "#64748b";
    if (["A+","A","A-"].includes(g)) return "#059669";
    if (["B+","B","B-"].includes(g)) return "#0284c7";
    if (["C+","C","C-"].includes(g)) return "#d97706";
    if (g === "D") return "#ea580c";
    return "#dc2626";
  },
  empty: { padding: "2rem", textAlign: "center", fontSize: "13px", color: "#64748b" },
  loading: { padding: "2rem", textAlign: "center", fontSize: "13px", color: "#64748b" },
};

export default function StudentStatusPage() {
  const [assignments, setAssignments]     = useState([]);
  const [enrollments, setEnrollments]     = useState([]);
  const [academicStatus, setAcadStatus]   = useState([]);
  const [allUsers, setAllUsers]           = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    async function load() {
      const [aRes, eRes, acRes, uRes] = await Promise.all([
        apiFetch("/course-assignments/"), apiFetch("/enrollments/"),
        apiFetch("/academic-status/"), apiFetch("/users/"),
      ]);
      if (aRes.ok) { const d = await aRes.json(); setAssignments(d); if (d.length > 0) setSelectedCourse(d[0]); }
      if (eRes.ok) setEnrollments(await eRes.json());
      if (acRes.ok) { const d = await acRes.json(); setAcadStatus(Array.isArray(d) ? d : [d]); }
      if (uRes.ok) setAllUsers(await uRes.json());
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div style={S.loading}>Loading student status…</div>;

  const courseEnrollments = selectedCourse
    ? enrollments.filter(e => e.course === selectedCourse.course)
    : [];

  return (
    <div style={S.wrap}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={S.sectionHead}>Your courses ({assignments.length})</div>
      {assignments.length === 0
        ? <div style={{ ...S.tableCard, padding: "2rem", textAlign: "center", fontSize: "13px", color: "#64748b" }}>No courses assigned this semester.</div>
        : <div style={S.courseGrid}>
            {assignments.map(a => (
              <div key={a.id}
                style={{ ...S.courseCard, ...(selectedCourse?.id === a.id ? S.courseCardActive : {}) }}
                onClick={() => setSelectedCourse(a)}>
                <div style={S.courseName}>{a.course_name || `Course #${a.course}`}</div>
                <div style={S.courseMeta}>{enrollments.filter(e => e.course === a.course).length} students</div>
              </div>
            ))}
          </div>
      }

      {selectedCourse && (
        <>
          <div style={S.sectionHead}>
            Students — {selectedCourse.course_name || `Course #${selectedCourse.course}`}
          </div>
          <div style={S.tableCard}>
            <div style={S.tableHeader}>
              <span>Student</span>
              <span>Grade</span>
              <span>Sem GPA</span>
              <span>Cum GPA</span>
              <span>Standing</span>
            </div>
            {courseEnrollments.length === 0
              ? <div style={S.empty}>No students enrolled in this course yet.</div>
              : courseEnrollments.map(e => {
                  const acStatus = academicStatus.find(a => a.student === e.student);
                  const user     = allUsers.find(u => u.id === e.student);
                  return (
                    <div key={e.id} style={S.tableRow}>
                      <span style={{ color: "#0f172a", fontWeight: "600" }}>{e.student_name || (user ? `${user.first_name} ${user.last_name}` : `Student #${e.student}`)}</span>
                      <span style={{ ...S.gpa, color: S.gradeColor(e.grade) }}>{e.grade || "—"}</span>
                      <span style={{ color: acStatus?.semester_gpa ? "#0284c7" : "#94a3b8", fontWeight: "700" }}>{acStatus?.semester_gpa ?? "—"}</span>
                      <span style={{ color: acStatus?.cumulative_gpa ? "#2563eb" : "#94a3b8", fontWeight: "700" }}>{acStatus?.cumulative_gpa ?? "—"}</span>
                      <span>{acStatus?.status ? <span style={S.statusBadge(acStatus.status)}>{acStatus.status}</span> : <span style={{ color: "#94a3b8", fontSize: "12px" }}>—</span>}</span>
                    </div>
                  );
                })
            }
          </div>
        </>
      )}
    </div>
  );
}
