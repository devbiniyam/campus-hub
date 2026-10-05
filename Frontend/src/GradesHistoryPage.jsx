import { useState, useEffect } from "react";
import { apiFetch } from "./api";

const S = {
  wrap: { animation: "fadeUp .4s ease both" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: "12px", marginBottom: "1.25rem" },
  statCard: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" },
  statValue: { fontSize: "26px", fontWeight: "800", marginBottom: "2px" },
  statLabel: { fontSize: "12px", color: "#64748b", fontWeight: "600" },
  sectionHead: { fontSize: "11px", fontWeight: "700", color: "#475569", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "10px" },
  semCard: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden", marginBottom: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" },
  semHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc", flexWrap: "wrap", gap: "8px" },
  semName: { fontSize: "14px", fontWeight: "700", color: "#0f172a" },
  gpaChip: (v) => ({
    fontSize: "12px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px",
    background: v >= 3.5 ? "#ecfdf5" : v >= 2.5 ? "#f0f9ff" : v >= 2.0 ? "#fffbeb" : "#fef2f2",
    border: `1px solid ${v >= 3.5 ? "#a7f3d0" : v >= 2.5 ? "#bae6fd" : v >= 2.0 ? "#fde68a" : "#fecaca"}`,
    color: v >= 3.5 ? "#059669" : v >= 2.5 ? "#0284c7" : v >= 2.0 ? "#d97706" : "#dc2626",
  }),
  tableHeader: { display: "grid", gridTemplateColumns: "1fr 80px 80px", padding: "12px 16px", fontSize: "11px", color: "#475569", fontWeight: "700", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" },
  tableRow: { display: "grid", gridTemplateColumns: "1fr 80px 80px", padding: "12px 16px", borderBottom: "1px solid #f1f5f9", fontSize: "13px", color: "#1e293b", alignItems: "center" },
  grade: { fontWeight: "800" },
  empty: { padding: "2rem", textAlign: "center", fontSize: "13px", color: "#64748b" },
  loading: { padding: "2rem", textAlign: "center", fontSize: "13px", color: "#64748b" },
  statusBadge: (s) => ({
    fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: "700",
    background: s === "ACTIVE" ? "#ecfdf5" : s === "PROBATION" ? "#fffbeb" : "#fef2f2",
    border: `1px solid ${s === "ACTIVE" ? "#a7f3d0" : s === "PROBATION" ? "#fde68a" : "#fecaca"}`,
    color: s === "ACTIVE" ? "#059669" : s === "PROBATION" ? "#d97706" : "#dc2626",
  }),
};

function gradeColor(g) {
  if (!g) return "#64748b";
  if (["A+","A","A-"].includes(g)) return "#059669";
  if (["B+","B","B-"].includes(g)) return "#0284c7";
  if (["C+","C","C-"].includes(g)) return "#d97706";
  if (g === "D") return "#ea580c";
  return "#dc2626";
}

export default function GradesHistoryPage() {
  const [enrollments, setEnrollments]   = useState([]);
  const [semesters, setSemesters]       = useState([]);
  const [academicStatus, setAcadStatus] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    async function load() {
      const [eRes, sRes, aRes] = await Promise.all([
        apiFetch("/enrollments/"), apiFetch("/semesters/"), apiFetch("/academic-status/"),
      ]);
      if (eRes.ok) setEnrollments(await eRes.json());
      if (sRes.ok) setSemesters(await sRes.json());
      if (aRes.ok) { const d = await aRes.json(); setAcadStatus(Array.isArray(d) ? d : [d]); }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div style={S.loading}>Loading your grades…</div>;

  const gradedEnrollments = enrollments.filter(e => e.grade);
  const latestStatus      = academicStatus[0];
  const cumGpa            = latestStatus?.cumulative_gpa;

  // Group enrollments by semester
  const bySemester = semesters.map(sem => ({
    ...sem,
    enrollments: enrollments.filter(e => e.semester === sem.id),
    status: academicStatus.find(a => a.semester === sem.id),
  })).filter(s => s.enrollments.length > 0);

  return (
    <div style={S.wrap}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={S.statsRow}>
        {[
          { label: "Cumulative GPA", value: cumGpa ?? "—",          color: cumGpa >= 3.5 ? "#059669" : cumGpa >= 2.0 ? "#0284c7" : "#dc2626" },
          { label: "Courses graded", value: gradedEnrollments.length, color: "#0284c7" },
          { label: "Semesters",      value: bySemester.length,        color: "#d97706" },
          { label: "Standing",       value: latestStatus?.status ?? "—", color: latestStatus?.status === "ACTIVE" ? "#059669" : latestStatus?.status === "PROBATION" ? "#d97706" : "#dc2626" },
        ].map(s => (
          <div key={s.label} style={{ ...S.statCard, borderTop: `3px solid ${s.color}` }}>
            <div style={{ ...S.statValue, color: s.color }}>{String(s.value)}</div>
            <div style={S.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={S.sectionHead}>Grade history by semester</div>

      {bySemester.length === 0
        ? <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "2rem", textAlign: "center", fontSize: "13px", color: "#64748b" }}>
            No grades recorded yet.
          </div>
        : bySemester.map(sem => {
            const gpa    = sem.status?.semester_gpa;
            const status = sem.status?.status;
            return (
              <div key={sem.id} style={S.semCard}>
                <div style={S.semHeader}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={S.semName}>{sem.name} — {sem.year}</span>
                    {status && <span style={S.statusBadge(status)}>{status}</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Semester GPA:</span>
                    {gpa
                      ? <span style={S.gpaChip(parseFloat(gpa))}>{gpa}</span>
                      : <span style={{ fontSize: "12px", color: "#94a3b8" }}>Not calculated yet</span>
                    }
                  </div>
                </div>
                <div style={S.tableHeader}><span>Course</span><span>Credits</span><span>Grade</span></div>
                {sem.enrollments.map(e => (
                  <div key={e.id} style={S.tableRow}>
                    <span style={{ color: "#0f172a", fontWeight: "600" }}>{e.course_name || `Course #${e.course}`}</span>
                    <span style={{ color: "#64748b" }}>—</span>
                    <span style={{ ...S.grade, color: gradeColor(e.grade) }}>{e.grade || <span style={{ color: "#d97706" }}>Pending</span>}</span>
                  </div>
                ))}
              </div>
            );
          })}
    </div>
  );
}
