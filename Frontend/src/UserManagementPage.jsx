import { useState, useEffect } from "react";
import { apiFetch } from "./api";

const S = {
  wrap: { animation: "fadeUp .4s ease both" },
  topRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "10px" },
  addBtn: { fontSize: "13px", padding: "8px 16px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: "700", boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)" },
  filterRow: { display: "flex", gap: "8px", marginBottom: "1.25rem", flexWrap: "wrap" },
  filterBtn: { fontSize: "12px", padding: "6px 14px", borderRadius: "20px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#475569", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: "600", transition: "all .15s ease" },
  filterBtnActive: { background: "#eff6ff", color: "#1d4ed8", borderColor: "#2563eb", fontWeight: "700" },
  tableCard: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", overflowX: "auto", overflowY: "hidden", WebkitOverflowScrolling: "touch", marginBottom: "1.25rem", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" },
  tableHeader: { display: "grid", gridTemplateColumns: "1fr 100px 120px 100px 120px", minWidth: "540px", padding: "12px 14px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "11px", color: "#475569", fontWeight: "700", textTransform: "uppercase" },
  tableRow: { display: "grid", gridTemplateColumns: "1fr 100px 120px 100px 120px", minWidth: "540px", padding: "12px 14px", borderBottom: "1px solid #f1f5f9", fontSize: "13px", color: "#1e293b", alignItems: "center" },
  roleBadge: (r) => ({
    fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: "700",
    background: r === "STUDENT" ? "#e0f2fe" : r === "TEACHER" ? "#ecfdf5" : "#fffbeb",
    border: `1px solid ${r === "STUDENT" ? "#bae6fd" : r === "TEACHER" ? "#a7f3d0" : "#fde68a"}`,
    color: r === "STUDENT" ? "#0284c7" : r === "TEACHER" ? "#059669" : "#d97706",
  }),
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
};

const EMPTY_FORM = { username: "", password: "", first_name: "", last_name: "", email: "", role: "STUDENT", student_id: "", staff_id: "", department: "", gender: "MALE", date_of_birth: "" };

export default function UserManagementPage() {
  const [users, setUsers]             = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roleFilter, setRoleFilter]   = useState("ALL");
  const [loading, setLoading]         = useState(true);
  const [modal, setModal]             = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");
  const [toast, setToast]             = useState({ msg: "", isError: false });

  const showToast = (msg, isError = false) => { setToast({ msg, isError }); setTimeout(() => setToast({ msg: "", isError: false }), 4000); };

  const load = async () => {
    const [uRes, dRes] = await Promise.all([apiFetch("/users/"), apiFetch("/departments/")]);
    if (uRes.ok) setUsers(await uRes.json());
    if (dRes.ok) setDepartments(await dRes.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY_FORM); setError(""); setModal("add"); };
  const openEdit = (u) => { setForm({ ...u, password: "" }); setError(""); setModal(u); };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.username || (!modal?.id && !form.password)) { setError("Username and password are required."); return; }
    setSaving(true); setError("");
    const isEdit = modal !== "add" && modal?.id;
    const body = { ...form };
    if (isEdit && !body.password) delete body.password;
    const res = await apiFetch(isEdit ? `/users/${modal.id}/` : "/users/", { method: isEdit ? "PATCH" : "POST", body: JSON.stringify(body) });
    const data = await res.json();
    if (res.ok) { showToast(isEdit ? "User updated!" : "User created!"); setModal(null); load(); }
    else setError(data?.detail || data?.username?.[0] || JSON.stringify(data));
    setSaving(false);
  };

  const handleDelete = async (id) => {
    const res = await apiFetch(`/users/${id}/`, { method: "DELETE" });
    if (res.ok || res.status === 204) { setUsers(p => p.filter(u => u.id !== id)); showToast("User deleted."); }
    else showToast("Cannot delete this user.", true);
  };

  const filtered = roleFilter === "ALL" ? users : users.filter(u => u.role === roleFilter);

  if (loading) return <div style={S.loading}>Loading users…</div>;

  return (
    <div style={S.wrap}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {toast.msg && <div style={{ ...S.toast, background: toast.isError ? "#2d1a1a" : "#1a2e1a", border: `1px solid ${toast.isError ? "#5c2a2a" : "#2a5c2a"}`, color: toast.isError ? "#f87171" : "#4ade80" }}>{toast.isError ? "⚠️" : "✓"} {toast.msg}</div>}

      {modal && (
        <div style={S.modal} onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div style={S.modalCard}>
            <div style={S.modalTitle}>{modal === "add" ? "Add user" : `Edit — ${modal.username}`}</div>
            {error && <div style={S.error}>{error}</div>}
            <div style={S.row2}>
              <div><label style={S.label}>First name</label><input style={S.input} value={form.first_name || ""} onChange={e => f("first_name", e.target.value)} /></div>
              <div><label style={S.label}>Last name</label><input style={S.input} value={form.last_name || ""} onChange={e => f("last_name", e.target.value)} /></div>
            </div>
            <label style={S.label}>Username *</label>
            <input style={S.input} value={form.username || ""} onChange={e => f("username", e.target.value)} />
            <label style={S.label}>{modal === "add" ? "Password *" : "New password (leave blank to keep)"}</label>
            <input style={S.input} type="password" value={form.password || ""} onChange={e => f("password", e.target.value)} />
            <label style={S.label}>Email</label>
            <input style={S.input} type="email" value={form.email || ""} onChange={e => f("email", e.target.value)} />
            <div style={S.row2}>
              <div>
                <label style={S.label}>Role *</label>
                <select style={S.select} value={form.role || "STUDENT"} onChange={e => f("role", e.target.value)}>
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div>
                <label style={S.label}>Gender</label>
                <select style={S.select} value={form.gender || "MALE"} onChange={e => f("gender", e.target.value)}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
            </div>
            <label style={S.label}>Department</label>
            <select style={S.select} value={form.department || ""} onChange={e => f("department", e.target.value)}>
              <option value="">— No department —</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <div style={S.row2}>
              <div><label style={S.label}>Student ID</label><input style={S.input} value={form.student_id || ""} onChange={e => f("student_id", e.target.value)} /></div>
              <div><label style={S.label}>Staff ID</label><input style={S.input} value={form.staff_id || ""} onChange={e => f("staff_id", e.target.value)} /></div>
            </div>
            <label style={S.label}>Date of birth</label>
            <input style={S.input} type="date" value={form.date_of_birth || ""} onChange={e => f("date_of_birth", e.target.value)} />
            <div style={S.modalBtns}>
              <button style={S.cancelBtn} onClick={() => setModal(null)}>Cancel</button>
              <button style={S.saveBtn} onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      <div style={S.topRow}>
        <span style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>Users ({users.length})</span>
        <button style={S.addBtn} onClick={openAdd}>+ Add user</button>
      </div>

      <div style={S.filterRow}>
        {["ALL", "STUDENT", "TEACHER", "ADMIN"].map(r => (
          <button key={r} style={{ ...S.filterBtn, ...(roleFilter === r ? S.filterBtnActive : {}) }} onClick={() => setRoleFilter(r)}>{r}</button>
        ))}
      </div>

      <div style={S.tableCard}>
        <div style={S.tableHeader}><span>Name</span><span>Username</span><span>Department</span><span>Role</span><span>Actions</span></div>
        {filtered.length === 0
          ? <div style={S.empty}>No users found.</div>
          : filtered.map(u => (
              <div key={u.id} style={S.tableRow}>
                <span style={{ color: "#0f172a", fontWeight: "600" }}>{u.first_name} {u.last_name}</span>
                <span style={{ color: "#0284c7", fontWeight: "600" }}>@{u.username}</span>
                <span style={{ color: "#64748b", fontSize: "12px", fontWeight: "500" }}>{departments.find(d => d.id === u.department)?.name || "—"}</span>
                <span><span style={S.roleBadge(u.role)}>{u.role}</span></span>
                <span>
                  <button style={{ ...S.actionBtn, borderColor: "#bae6fd", color: "#0284c7", background: "#f0f9ff" }} onClick={() => openEdit(u)}>Edit</button>
                  <button style={{ ...S.actionBtn, borderColor: "#fecaca", color: "#dc2626", background: "#fef2f2" }} onClick={() => handleDelete(u.id)}>Delete</button>
                </span>
              </div>
            ))}
      </div>
    </div>
  );
}
