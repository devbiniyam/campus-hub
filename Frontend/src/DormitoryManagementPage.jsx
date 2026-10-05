import { useState, useEffect } from "react";
import { apiFetch } from "./api";

const S = {
  wrap: { animation: "fadeUp .4s ease both" },
  topRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "10px" },
  addBtn: { fontSize: "13px", padding: "8px 16px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: "700", boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)" },
  tableCard: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden", marginBottom: "1.25rem", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" },
  tableHeader: { display: "grid", padding: "12px 14px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "11px", color: "#475569", fontWeight: "700", textTransform: "uppercase" },
  tableRow: { display: "grid", padding: "12px 14px", borderBottom: "1px solid #f1f5f9", fontSize: "13px", color: "#1e293b", alignItems: "center" },
  actionBtn: { fontSize: "11px", padding: "5px 12px", borderRadius: "6px", border: "1px solid", cursor: "pointer", fontWeight: "700", background: "transparent", fontFamily: "'DM Sans', sans-serif", marginRight: "6px" },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(15, 23, 42, 0.45)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    overflowY: "auto",
    zIndex: 200,
    padding: "2rem 1rem",
  },
  modalCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "1.5rem",
    width: "100%",
    maxWidth: "460px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
  },
  modalTitle: { fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "1.25rem" },
  label: { fontSize: "12px", color: "#475569", marginBottom: "4px", display: "block", fontWeight: "700" },
  input: { background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "8px 12px", color: "#0f172a", fontSize: "13px", width: "100%", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box", marginBottom: "12px" },
  select: { background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "8px 12px", color: "#0f172a", fontSize: "13px", width: "100%", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box", marginBottom: "12px" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  modalBtns: { display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "4px" },
  cancelBtn: { fontSize: "13px", padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", color: "#64748b", background: "#ffffff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: "600" },
  saveBtn: { fontSize: "13px", padding: "8px 20px", borderRadius: "8px", border: "none", color: "#fff", background: "linear-gradient(135deg, #1d4ed8, #2563eb)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: "700", boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)" },
  error: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", color: "#dc2626", marginBottom: "12px", fontWeight: "600" },
  toast: { position: "fixed", bottom: "20px", right: "20px", borderRadius: "10px", padding: "10px 16px", fontSize: "13px", zIndex: 300, fontWeight: "700" },
  empty: { padding: "2rem", textAlign: "center", fontSize: "13px", color: "#64748b" },
  loading: { padding: "2rem", textAlign: "center", fontSize: "13px", color: "#64748b" },
  tabRow: { display: "flex", gap: "8px", marginBottom: "1.25rem" },
  tab: { fontSize: "13px", padding: "7px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#ffffff", color: "#64748b", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: "600" },
  tabActive: { background: "#eff6ff", color: "#1d4ed8", borderColor: "#bfdbfe", fontWeight: "700" },
};

export default function DormitoryManagementPage() {
  const [dorms, setDorms]           = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents]     = useState([]);
  const [semesters, setSemesters]   = useState([]);
  const [departments, setDepts]     = useState([]);
  const [tab, setTab]               = useState("dorms");
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(null);
  const [form, setForm]             = useState({});
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState("");
  const [toast, setToast]           = useState({ msg: "", isError: false });

  const showToast = (msg, isError = false) => { setToast({ msg, isError }); setTimeout(() => setToast({ msg: "", isError: false }), 4000); };

  const load = async () => {
    const [dRes, aRes, uRes, sRes, depRes] = await Promise.all([
      apiFetch("/dormitories/"), apiFetch("/dormitory-assignments/"),
      apiFetch("/users/"), apiFetch("/semesters/"), apiFetch("/departments/"),
    ]);
    if (dRes.ok) setDorms(await dRes.json());
    if (aRes.ok) setAssignments(await aRes.json());
    if (uRes.ok) { const u = await uRes.json(); setStudents(u.filter(x => x.role === "STUDENT")); }
    if (sRes.ok) setSemesters(await sRes.json());
    if (depRes.ok) setDepts(await depRes.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true); setError("");
    let res, data;
    if (modal === "dorm") {
      res = await apiFetch("/dormitories/", { method: "POST", body: JSON.stringify(form) });
    } else if (modal === "assign") {
      res = await apiFetch("/dormitory-assignments/", { method: "POST", body: JSON.stringify(form) });
    } else {
      res = await apiFetch(`/dormitories/${modal.id}/`, { method: "PATCH", body: JSON.stringify(form) });
    }
    data = await res.json();
    if (res.ok) { showToast("Saved!"); setModal(null); load(); }
    else setError(data?.detail || data?.non_field_errors?.[0] || JSON.stringify(data));
    setSaving(false);
  };

  const del = async (url, id, setter) => {
    const res = await apiFetch(`${url}${id}/`, { method: "DELETE" });
    if (res.ok || res.status === 204) { setter(p => p.filter(x => x.id !== id)); showToast("Deleted."); }
    else showToast("Cannot delete.", true);
  };

  if (loading) return <div style={S.loading}>Loading dormitories…</div>;

  return (
    <div style={S.wrap}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {toast.msg && <div style={{ ...S.toast, background: toast.isError ? "#fef2f2" : "#f0fdf4", border: `1px solid ${toast.isError ? "#fecaca" : "#bbf7d0"}`, color: toast.isError ? "#dc2626" : "#16a34a" }}>{toast.isError ? "⚠️" : "✓"} {toast.msg}</div>}

      {modal && (
        <div style={S.modal} onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div style={S.modalCard}>
            <div style={S.modalTitle}>{modal === "dorm" ? "Add dormitory room" : modal === "assign" ? "Assign student to dorm" : "Edit dormitory"}</div>
            {error && <div style={S.error}>{error}</div>}

            {(modal === "dorm" || modal?.id) && (
              <>
                <div style={S.row2}>
                  <div><label style={S.label}>Block</label><input style={S.input} type="number" value={form.block || ""} onChange={e => f("block", e.target.value)} /></div>
                  <div><label style={S.label}>Room</label><input style={S.input} type="number" value={form.room || ""} onChange={e => f("room", e.target.value)} /></div>
                </div>
                <label style={S.label}>Gender</label>
                <select style={S.select} value={form.gender || "MALE"} onChange={e => f("gender", e.target.value)}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
                <label style={S.label}>Capacity</label>
                <input style={S.input} type="number" value={form.capacity || 4} onChange={e => f("capacity", e.target.value)} />
                <label style={S.label}>Department (optional)</label>
                <select style={S.select} value={form.department || ""} onChange={e => f("department", e.target.value)}>
                  <option value="">— No restriction —</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </>
            )}

            {modal === "assign" && (
              <>
                <label style={S.label}>Student</label>
                <select style={S.select} value={form.student || ""} onChange={e => f("student", e.target.value)}>
                  <option value="">— Select student —</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.gender})</option>)}
                </select>
                <label style={S.label}>Dormitory room</label>
                <select style={S.select} value={form.dormitory || ""} onChange={e => f("dormitory", e.target.value)}>
                  <option value="">— Select room —</option>
                  {dorms.map(d => <option key={d.id} value={d.id}>Block {d.block}, Room {d.room} — {d.gender} (cap: {d.capacity})</option>)}
                </select>
                <label style={S.label}>Semester</label>
                <select style={S.select} value={form.semester || ""} onChange={e => f("semester", e.target.value)}>
                  <option value="">— Select semester —</option>
                  {semesters.map(s => <option key={s.id} value={s.id}>{s.name} {s.year}{s.is_active ? " (Active)" : ""}</option>)}
                </select>
              </>
            )}

            <div style={S.modalBtns}>
              <button style={S.cancelBtn} onClick={() => setModal(null)}>Cancel</button>
              <button style={S.saveBtn} onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      <div style={S.tabRow}>
        <button style={{ ...S.tab, ...(tab === "dorms" ? S.tabActive : {}) }} onClick={() => setTab("dorms")}>Rooms ({dorms.length})</button>
        <button style={{ ...S.tab, ...(tab === "assignments" ? S.tabActive : {}) }} onClick={() => setTab("assignments")}>Assignments ({assignments.length})</button>
      </div>

      {tab === "dorms" && (
        <>
          <div style={S.topRow}>
            <span style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>Dormitory rooms</span>
            <button style={S.addBtn} onClick={() => { setForm({ gender: "MALE", capacity: 4 }); setError(""); setModal("dorm"); }}>+ Add room</button>
          </div>
          <div style={S.tableCard}>
            <div style={{ ...S.tableHeader, gridTemplateColumns: "80px 80px 100px 80px 1fr 120px" }}>
              <span>Block</span><span>Room</span><span>Gender</span><span>Capacity</span><span>Department</span><span>Actions</span>
            </div>
            {dorms.length === 0 ? <div style={S.empty}>No dormitory rooms yet.</div>
              : dorms.map(d => (
                <div key={d.id} style={{ ...S.tableRow, gridTemplateColumns: "80px 80px 100px 80px 1fr 120px" }}>
                  <span style={{ color: "#0f172a", fontWeight: "700" }}>Block {d.block}</span>
                  <span style={{ color: "#334155", fontWeight: "600" }}>Room {d.room}</span>
                  <span>
                    <span style={d.gender === "MALE"
                      ? { color: "#0284c7", background: "#f0f9ff", border: "1px solid #bae6fd", padding: "2px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", display: "inline-block" }
                      : { color: "#be185d", background: "#fdf2f8", border: "1px solid #fbcfe8", padding: "2px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", display: "inline-block" }
                    }>
                      {d.gender}
                    </span>
                  </span>
                  <span style={{ color: "#475569", fontWeight: "600" }}>{d.capacity} beds</span>
                  <span style={{ color: "#64748b", fontSize: "12px" }}>{departments.find(dep => dep.id === d.department)?.name || "Any"}</span>
                  <span>
                    <button style={{ ...S.actionBtn, borderColor: "#bfdbfe", background: "#eff6ff", color: "#1d4ed8" }} onClick={() => { setForm(d); setError(""); setModal(d); }}>Edit</button>
                    <button style={{ ...S.actionBtn, borderColor: "#fecaca", background: "#fef2f2", color: "#dc2626" }} onClick={() => del("/dormitories/", d.id, setDorms)}>Del</button>
                  </span>
                </div>
              ))}
          </div>
        </>
      )}

      {tab === "assignments" && (
        <>
          <div style={S.topRow}>
            <span style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>Dormitory assignments</span>
            <button style={S.addBtn} onClick={() => { setForm({}); setError(""); setModal("assign"); }}>+ Assign student</button>
          </div>
          <div style={S.tableCard}>
            <div style={{ ...S.tableHeader, gridTemplateColumns: "1fr 140px 120px 80px" }}>
              <span>Student</span><span>Room</span><span>Semester</span><span>Actions</span>
            </div>
            {assignments.length === 0 ? <div style={S.empty}>No assignments yet.</div>
              : assignments.map(a => {
                const student = students.find(s => s.id === a.student);
                const dorm    = dorms.find(d => d.id === a.dormitory);
                const sem     = semesters.find(s => s.id === a.semester);
                return (
                  <div key={a.id} style={{ ...S.tableRow, gridTemplateColumns: "1fr 140px 120px 80px" }}>
                    <span style={{ color: "#0f172a", fontWeight: "600" }}>{student ? `${student.first_name} ${student.last_name}` : `Student #${a.student}`}</span>
                    <span style={{ color: "#0284c7", fontWeight: "600" }}>{dorm ? `Block ${dorm.block} · Room ${dorm.room}` : `Room #${a.dormitory}`}</span>
                    <span style={{ color: "#64748b", fontSize: "12px" }}>{sem ? `${sem.name} ${sem.year}` : `Sem #${a.semester}`}</span>
                    <span><button style={{ ...S.actionBtn, borderColor: "#fecaca", background: "#fef2f2", color: "#dc2626" }} onClick={() => del("/dormitory-assignments/", a.id, setAssignments)}>Del</button></span>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}
