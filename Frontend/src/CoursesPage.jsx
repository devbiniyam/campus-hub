import { useState, useEffect } from "react";
import { apiFetch } from "./api";

const S = {
  wrap: { animation: "fadeUp .4s ease both" },
  banner: {
    background: "linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)",
    border: "1px solid #bae6fd", borderRadius: "16px",
    padding: "1.5rem", marginBottom: "1.25rem",
    boxShadow: "0 4px 20px rgba(2, 132, 199, 0.08)",
  },
  bannerTitle: { fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" },
  bannerSub: { fontSize: "13px", color: "#0369a1", fontWeight: "500" },
  searchRow: {
    display: "flex", gap: "10px", marginBottom: "1.25rem", flexWrap: "wrap",
  },
  searchInput: {
    background: "#ffffff", border: "1px solid #cbd5e1",
    borderRadius: "10px", padding: "8px 14px",
    color: "#0f172a", fontSize: "13px", flex: 1, minWidth: "200px",
    fontFamily: "'DM Sans', sans-serif", outline: "none",
  },
  filterBtn: {
    fontSize: "12px", padding: "8px 16px", borderRadius: "20px",
    border: "1px solid #cbd5e1", background: "#ffffff",
    color: "#475569", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", fontWeight: "600",
    transition: "all 0.15s ease",
  },
  filterBtnActive: {
    background: "#eff6ff", color: "#1d4ed8",
    borderColor: "#2563eb", fontWeight: "700",
  },
  sectionHead: {
    fontSize: "11px", fontWeight: "700", color: "#64748b",
    letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "10px",
  },
  deptSection: { marginBottom: "1.75rem" },
  deptHeader: {
    display: "flex", alignItems: "center", gap: "10px",
    marginBottom: "10px",
  },
  deptName: { fontSize: "15px", fontWeight: "700", color: "#0f172a" },
  deptCode: {
    fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
    background: "#e0f2fe", border: "1px solid #bae6fd", color: "#0284c7", fontWeight: "700",
  },
  courseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
    gap: "10px",
  },
  courseCard: {
    background: "#ffffff", border: "1px solid #e2e8f0",
    borderRadius: "14px", padding: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
  },
  courseName: { fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" },
  courseMeta: { fontSize: "12px", color: "#64748b", marginBottom: "6px" },
  creditBadge: {
    display: "inline-block", fontSize: "11px", padding: "2px 8px",
    borderRadius: "20px", background: "#f1f5f9",
    border: "1px solid #cbd5e1", color: "#334155", fontWeight: "600",
  },
  activeBadge: {
    display: "inline-block", fontSize: "11px", padding: "2px 8px",
    borderRadius: "20px", background: "#ecfdf5",
    border: "1px solid #a7f3d0", color: "#059669", marginLeft: "6px", fontWeight: "600",
  },
  inactiveBadge: {
    display: "inline-block", fontSize: "11px", padding: "2px 8px",
    borderRadius: "20px", background: "#fef2f2",
    border: "1px solid #fecaca", color: "#dc2626", marginLeft: "6px", fontWeight: "600",
  },
  empty: {
    padding: "2rem", textAlign: "center",
    fontSize: "13px", color: "#64748b",
    background: "#ffffff", border: "1px solid #e2e8f0",
    borderRadius: "12px",
  },
  loading: { padding: "2rem", textAlign: "center", fontSize: "13px", color: "#64748b" },
  statsRow: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))",
    gap: "10px", marginBottom: "1.25rem",
  },
  statCard: {
    background: "#ffffff", border: "1px solid #e2e8f0",
    borderRadius: "12px", padding: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
  },
  statValue: { fontSize: "24px", fontWeight: "800", marginBottom: "2px" },
  statLabel: { fontSize: "12px", color: "#64748b", fontWeight: "600" },
};

export default function CoursesPage({ role }) {
  const [courses, setCourses]         = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch]           = useState("");
  const [deptFilter, setDeptFilter]   = useState("all");
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cRes, dRes] = await Promise.all([
          apiFetch("/courses/"),
          apiFetch("/departments/"),
        ]);
        if (cRes.ok) setCourses(await cRes.json());
        if (dRes.ok) setDepartments(await dRes.json());
      } finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <div style={S.loading}>Loading courses…</div>;

  // Filter by search and department
  const filtered = courses.filter(c => {
    const matchSearch = search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "all" || c.department === parseInt(deptFilter);
    return matchSearch && matchDept;
  });

  // Group by department
  const grouped = departments.map(d => ({
    ...d,
    courses: filtered.filter(c => c.department === d.id),
  })).filter(d => d.courses.length > 0);

  const activeCourses = courses.filter(c => c.is_active).length;

  return (
    <div style={S.wrap}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={S.banner}>
        <div style={S.bannerTitle}>Courses & Departments</div>
        <div style={S.bannerSub}>
          {role === "STUDENT" && "Browse courses available in your department."}
          {role === "TEACHER" && "Courses offered across all departments."}
          {role === "ADMIN"   && "All courses grouped by department."}
        </div>
      </div>

      {/* Stats */}
      <div style={S.statsRow}>
        {[
          { label: "Total courses",   value: courses.length,      color: "#0284c7" },
          { label: "Active courses",  value: activeCourses,        color: "#059669" },
          { label: "Departments",     value: departments.length,   color: "#d97706" },
        ].map(s => (
          <div key={s.label} style={{ ...S.statCard, borderTop: `3px solid ${s.color}` }}>
            <div style={{ ...S.statValue, color: s.color }}>{s.value}</div>
            <div style={S.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div style={S.searchRow}>
        <input
          style={S.searchInput}
          placeholder="Search by course name or code…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          style={{ ...S.filterBtn, ...(deptFilter === "all" ? S.filterBtnActive : {}) }}
          onClick={() => setDeptFilter("all")}>
          All
        </button>
        {departments.map(d => (
          <button key={d.id}
            style={{ ...S.filterBtn, ...(deptFilter === String(d.id) ? S.filterBtnActive : {}) }}
            onClick={() => setDeptFilter(String(d.id))}>
            {d.code}
          </button>
        ))}
      </div>

      {/* Courses grouped by department */}
      {grouped.length === 0
        ? <div style={S.empty}>No courses found matching your search.</div>
        : grouped.map(dept => (
            <div key={dept.id} style={S.deptSection}>
              <div style={S.deptHeader}>
                <span style={S.deptName}>{dept.name}</span>
                <span style={S.deptCode}>{dept.code}</span>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
                  {dept.courses.length} course{dept.courses.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div style={S.courseGrid}>
                {dept.courses.map(c => (
                  <div key={c.id} style={S.courseCard}>
                    <div style={S.courseName}>{c.name}</div>
                    <div style={S.courseMeta}>{c.code}</div>
                    <span style={S.creditBadge}>
                      {c.credit_hours} credit{c.credit_hours !== 1 ? "s" : ""}
                    </span>
                    <span style={c.is_active ? S.activeBadge : S.inactiveBadge}>
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
      }
    </div>
  );
}