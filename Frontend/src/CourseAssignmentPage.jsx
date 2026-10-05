import { useState, useEffect } from "react";
import { apiFetch } from "./api";

const S = {
  wrap: { animation: "fadeUp .4s ease both" },
  topRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "10px" },
  addBtn: { fontSize: "13px", padding: "8px 16px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: "700", boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)" },
  tableCard: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", overflowX: "auto", overflowY: "hidden", WebkitOverflowScrolling: "touch", marginBottom: "1.25rem", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" },
  tableHeader: { display: "grid", minWidth: "540px", padding: "12px 14px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "11px", color: "#475569", fontWeight: "700", textTransform: "uppercase" },
  tableRow: { display: "grid", minWidth: "540px", padding: "12px 14px", borderBottom: "1px solid #f1f5f9", fontSize: "13px", color: "#1e293b", alignItems: "center" },
  actionBtn: { fontSize: "11px", padding: "5px 12px", borderRadius: "6px", border: "1px solid", cursor: "pointer", fontWeight: "700", background: "transparent", fontFamily: "'DM Sans', sans-serif", marginRight: "6px" },
  modal: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "flex-start", justifyContent: "center",
    overflowY: "auto", zIndex: 200, padding: "2rem 1rem",
  },
  modalCard: {
    background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px",
    padding: "1.5rem", width: "100%", maxWidth: "460px", marginTop: "1rem",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
  },
  modalTitle: { fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "1.25rem" },
  label: { fontSize: "12px", color: "#475569", marginBottom: "4px", display: "block", fontWeight: "700" },
  select: { background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "8px 12px", color: "#0f172a", fontSize: "13px", width: "100%", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box", marginBottom: "12px" },
  input: { background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "8px 12px", color: "#0f172a", fontSize: "13px", width: "100%", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box", marginBottom: "12px" },
  modalBtns: { display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "4px" },
  cancelBtn: { fontSize: "13px", padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", color: "#64748b", background: "#ffffff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: "600" },
  saveBtn: { fontSize: "13px", padding: "8px 20px", borderRadius: "8px", border: "none", color: "#fff", background: "linear-gradient(135deg, #1d4ed8, #2563eb)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: "700", boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)" },
  error: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", color: "#dc2626", marginBottom: "12px", fontWeight: "600" },
  toast: { position: "fixed", bottom: "20px", right: "20px", borderRadius: "10px", padding: "10px 16px", fontSize: "13px", zIndex: 300, fontWeight: "700" },
  empty: { padding: "2rem", textAlign: "center", fontSize: "13px", color: "#64748b" },
  loading: { padding: "2rem", textAlign: "center", fontSize: "13px", color: "#64748b" },
};

const EMPTY = { course: "", teacher: "", semester: "", teaching_role: "Lecturer" };

export default function CourseAssignmentPage() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses]         = useState([]);
  const [teachers, setTeachers]       = useState([]);
  const [semesters, setSemesters]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [modal, setModal]             = useState(false);
  const [form, setForm]               = useState(EMPTY);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");
  const [toast, setToast]             = useState({ msg: "", isError: false });

  const showToast = (msg, isError = false) => { setToast({ msg, isError }); setTimeout(() => setToast({ msg: "", isError: false }), 4000); };

  const load = async () => {
    const [aRes, cRes, uRes, sRes] = await Promise.all([
      apiFetch("/course-assignments/"), apiFetch("/courses/"),
      apiFetch("/users/"), apiFetch("/semesters/"),
    ]);
    if (aRes.ok) setAssignments(await aRes.json());
    if (cRes.ok) setCourses(await cRes.json());
    if (uRes.ok) { const u = await uRes.json(); setTeachers(u.filter(x => x.role === "TEACHER")); }
    if (sRes.ok) setSemesters(await sRes.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.course || !form.teacher || !form.semester) { setError("All fields are required."); return; }
    setSaving(true); setError("");
    const res = await apiFetch("/course-assignments/", { method: "POST", body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { showToast("Course assigned!"); setModal(false); load(); }
    else setError(data?.detail || data?.non_field_errors?.[0] || JSON.stringify(data));
    setSaving(false);
  };

  const handleDelete = async (id) => {
    const res = await apiFetch(`/course-assignments/${id}/`, { method: "DELETE" });
    if (res.ok || res.status === 204) { setAssignments(p => p.filter(a => a.id !== id)); showToast("Deleted."); }
    else showToast("Cannot delete.", true);
  };

  if (loading) return <div style={S.loading}>Loading course assignments…</div>;

  return (
    <div style={S.wrap}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {toast.msg && <div style={{ ...S.toast, background: toast.isError ? "#fef2f2" : "#f0fdf4", border: `1px solid ${toast.isError ? "#fecaca" : "#bbf7d0"}`, color: toast.isError ? "#dc2626" : "#16a34a" }}>{toast.isError ? "⚠️" : "✓"} {toast.msg}</div>}

      {modal && (
        <div style={S.modal} onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div style={S.modalCard}>
            <div style={S.modalTitle}>Assign teacher to course</div>
            {error && <div style={S.error}>{error}</div>}
            <label style={S.label}>Course</label>
            <select style={S.select} value={form.course} onChange={e => f("course", e.target.value)}>
              <option value="">— Select course —</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
            </select>
            <label style={S.label}>Teacher</label>
            <select style={S.select} value={form.teacher} onChange={e => f("teacher", e.target.value)}>
              <option value="">— Select teacher —</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name} (@{t.username})</option>)}
            </select>
            <label style={S.label}>Semester</label>
            <select style={S.select} value={form.semester} onChange={e => f("semester", e.target.value)}>
              <option value="">— Select semester —</option>
              {semesters.map(s => <option key={s.id} value={s.id}>{s.name} {s.year}{s.is_active ? " (Active)" : ""}</option>)}
            </select>
            <label style={S.label}>Teaching role</label>
            <input style={S.input} value={form.teaching_role} onChange={e => f("teaching_role", e.target.value)} placeholder="Lecturer" />
            <div style={S.modalBtns}>
              <button style={S.cancelBtn} onClick={() => setModal(false)}>Cancel</button>
              <button style={S.saveBtn} onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Assign"}</button>
            </div>
          </div>
        </div>
      )}

      <div style={S.topRow}>
        <span style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>Course Assignments ({assignments.length})</span>
        <button style={S.addBtn} onClick={() => { setForm(EMPTY); setError(""); setModal(true); }}>+ Assign teacher</button>
      </div>

      <div style={S.tableCard}>
        <div style={{ ...S.tableHeader, gridTemplateColumns: "1fr 1fr 120px 80px 80px" }}>
          <span>Course</span><span>Teacher</span><span>Semester</span><span>Role</span><span>Actions</span>
        </div>
        {assignments.length === 0 ? <div style={S.empty}>No assignments yet.</div>
          : assignments.map(a => {
            const course  = courses.find(c => c.id === a.course);
            const teacher = teachers.find(t => t.id === a.teacher);
            const sem     = semesters.find(s => s.id === a.semester);
            return (
              <div key={a.id} style={{ ...S.tableRow, gridTemplateColumns: "1fr 1fr 120px 80px 80px" }}>
                <span style={{ color: "#0f172a", fontWeight: "600" }}>{course?.name || `Course #${a.course}`}</span>
                <span style={{ color: "#059669", fontWeight: "600" }}>{teacher ? `${teacher.first_name} ${teacher.last_name}` : `Teacher #${a.teacher}`}</span>
                <span style={{ color: "#64748b", fontSize: "12px" }}>{sem ? `${sem.name} ${sem.year}` : `Sem #${a.semester}`}</span>
                <span style={{ color: "#475569", fontSize: "12px", background: "#f1f5f9", padding: "2px 8px", borderRadius: "6px", width: "fit-content" }}>{a.teaching_role}</span>
                <span><button style={{ ...S.actionBtn, borderColor: "#fecaca", background: "#fef2f2", color: "#dc2626" }} onClick={() => handleDelete(a.id)}>Delete</button></span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
