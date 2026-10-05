import { useState, useEffect } from "react";
import { apiFetch } from "./api";

const S = {
  wrap: { animation: "fadeUp .4s ease both" },
  topRow: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: "1.25rem",
    flexWrap: "wrap", gap: "10px",
  },
  title: { fontSize: "15px", fontWeight: "700", color: "#0f172a" },
  addBtn: {
    fontSize: "13px", padding: "8px 16px", borderRadius: "10px",
    border: "none", background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
    color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    fontWeight: "700", boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
  },
  tableCard: {
    background: "#ffffff", border: "1px solid #e2e8f0",
    borderRadius: "14px", overflowX: "auto", overflowY: "hidden",
    WebkitOverflowScrolling: "touch", marginBottom: "1.25rem",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
  },
  tableHeader: {
    display: "grid", gridTemplateColumns: "1fr 80px 110px 110px 80px 140px",
    minWidth: "620px",
    padding: "12px 14px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc",
    fontSize: "11px", color: "#475569", fontWeight: "700", textTransform: "uppercase",
  },
  tableRow: {
    display: "grid", gridTemplateColumns: "1fr 80px 110px 110px 80px 140px",
    minWidth: "620px",
    padding: "12px 14px", borderBottom: "1px solid #f1f5f9",
    fontSize: "13px", color: "#1e293b", alignItems: "center",
  },
  activeBadge: {
    fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
    background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#059669", fontWeight: "700",
  },
  inactiveBadge: {
    fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
    background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#64748b", fontWeight: "600",
  },
  actionBtn: {
    fontSize: "11px", padding: "5px 10px", borderRadius: "6px",
    border: "1px solid", cursor: "pointer", fontWeight: "700",
    background: "transparent", fontFamily: "'DM Sans', sans-serif",
    marginRight: "4px",
  },
  modal: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "flex-start", justifyContent: "center",
    overflowY: "auto", zIndex: 200, padding: "0",
  },
  modalCard: {
    background: "#ffffff", border: "1px solid #e2e8f0",
    borderRadius: "16px", padding: "1.5rem", width: "100%",
    maxWidth: "480px", margin: "20px auto",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
  },
  modalTitle: { fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "1.25rem" },
  label: { fontSize: "12px", color: "#475569", marginBottom: "4px", display: "block", fontWeight: "700" },
  input: {
    background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px",
    padding: "8px 12px", color: "#0f172a", fontSize: "13px", width: "100%",
    fontFamily: "'DM Sans', sans-serif", outline: "none",
    boxSizing: "border-box", marginBottom: "12px",
  },
  checkRow: {
    display: "flex", alignItems: "center", gap: "8px",
    marginBottom: "16px", cursor: "pointer",
  },
  checkLabel: { fontSize: "13px", color: "#334155", fontWeight: "600" },
  modalBtns: { display: "flex", gap: "8px", justifyContent: "flex-end" },
  cancelBtn: {
    fontSize: "13px", padding: "8px 16px", borderRadius: "8px",
    border: "1px solid #cbd5e1", color: "#64748b",
    background: "#ffffff", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", fontWeight: "600",
  },
  saveBtn: {
    fontSize: "13px", padding: "8px 20px", borderRadius: "8px",
    border: "none", color: "#fff",
    background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: "700",
    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
  },
  error: {
    background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px",
    padding: "8px 12px", fontSize: "12px", color: "#dc2626", marginBottom: "12px", fontWeight: "600",
  },
  toast: {
    position: "fixed", bottom: "20px", right: "20px",
    borderRadius: "10px", padding: "10px 16px", fontSize: "13px", zIndex: 300, fontWeight: "700",
  },
  empty: { padding: "2rem", textAlign: "center", fontSize: "13px", color: "#64748b" },
  loading: { padding: "2rem", textAlign: "center", fontSize: "13px", color: "#64748b" },
};

const EMPTY_FORM = { name: "", year: "", start_date: "", end_date: "", is_active: false };

export default function SemesterManagementPage() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(null); // null | "add" | semester object
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [toast, setToast]         = useState({ msg: "", isError: false });
  const [deleting, setDeleting]   = useState(null);

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast({ msg: "", isError: false }), 4000);
  };

  const load = async () => {
    const res = await apiFetch("/semesters/");
    if (res.ok) setSemesters(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setError(""); setModal("add"); };

  const openEdit = (s) => {
    setForm({
      name: s.name, year: s.year,
      start_date: s.start_date, end_date: s.end_date,
      is_active: s.is_active,
    });
    setError("");
    setModal(s);
  };

  const handleSave = async () => {
    if (!form.name || !form.year || !form.start_date || !form.end_date) {
      setError("All fields are required."); return;
    }
    setSaving(true); setError("");
    const isEdit = modal !== "add";
    const res = await apiFetch(
      isEdit ? `/semesters/${modal.id}/` : "/semesters/",
      { method: isEdit ? "PATCH" : "POST", body: JSON.stringify(form) }
    );
    const data = await res.json();
    if (res.ok) {
      showToast(isEdit ? "Semester updated!" : "Semester created!");
      setModal(null);
      load();
    } else {
      setError(data?.detail || data?.non_field_errors?.[0] || JSON.stringify(data));
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    const res = await apiFetch(`/semesters/${id}/`, { method: "DELETE" });
    if (res.ok || res.status === 204) {
      setSemesters(prev => prev.filter(s => s.id !== id));
      showToast("Semester deleted.");
    } else {
      showToast("Cannot delete this semester.", true);
    }
    setDeleting(null);
  };

  const handleActivate = async (s) => {
    const res = await apiFetch(`/semesters/${s.id}/`, {
      method: "PATCH",
      body: JSON.stringify({ is_active: true }),
    });
    if (res.ok) {
      showToast(`${s.name} ${s.year} is now active.`);
      load();
    } else {
      const d = await res.json();
      showToast(d?.detail || d?.non_field_errors?.[0] || "Error activating semester.", true);
    }
  };

  if (loading) return <div style={S.loading}>Loading semesters…</div>;

  return (
    <div style={S.wrap}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {toast.msg && (
        <div style={{
          ...S.toast,
          background: toast.isError ? "#2d1a1a" : "#1a2e1a",
          border: `1px solid ${toast.isError ? "#5c2a2a" : "#2a5c2a"}`,
          color: toast.isError ? "#f87171" : "#4ade80",
        }}>
          {toast.isError ? "⚠️" : "✓"} {toast.msg}
        </div>
      )}

      {modal && (
        <div style={S.modal} onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div style={S.modalCard}>
            <div style={S.modalTitle}>
              {modal === "add" ? "Add semester" : `Edit — ${modal.name} ${modal.year}`}
            </div>
            {error && <div style={S.error}>{error}</div>}
            {[
              { label: "Semester name", key: "name",       placeholder: "e.g. First Semester" },
              { label: "Year",          key: "year",       placeholder: "e.g. 2025" },
              { label: "Start date",    key: "start_date", placeholder: "", type: "date" },
              { label: "End date",      key: "end_date",   placeholder: "", type: "date" },
            ].map(f => (
              <div key={f.key}>
                <label style={S.label}>{f.label}</label>
                <input style={S.input} type={f.type || "text"}
                  placeholder={f.placeholder}
                  value={form[f.key] || ""}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
            <div style={S.checkRow} onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))}>
              <input type="checkbox" checked={form.is_active} onChange={() => {}}
                style={{ width: "16px", height: "16px", cursor: "pointer" }} />
              <span style={S.checkLabel}>Set as active semester</span>
            </div>
            <div style={S.modalBtns}>
              <button style={S.cancelBtn} onClick={() => setModal(null)}>Cancel</button>
              <button style={S.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={S.topRow}>
        <span style={S.title}>Semesters ({semesters.length})</span>
        <button style={S.addBtn} onClick={openAdd}>+ Add semester</button>
      </div>

      <div style={S.tableCard}>
        <div style={S.tableHeader}>
          <span>Name</span>
          <span>Year</span>
          <span>Start</span>
          <span>End</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {semesters.length === 0
          ? <div style={S.empty}>No semesters yet. Add one to get started.</div>
          : semesters.map(s => (
              <div key={s.id} style={S.tableRow}>
                <span style={{ color: "#0f172a", fontWeight: "600" }}>{s.name}</span>
                <span style={{ color: "#0284c7", fontWeight: "700" }}>{s.year}</span>
                <span style={{ color: "#64748b" }}>{s.start_date}</span>
                <span style={{ color: "#64748b" }}>{s.end_date}</span>
                <span>
                  <span style={s.is_active ? S.activeBadge : S.inactiveBadge}>
                    {s.is_active ? "Active" : "Inactive"}
                  </span>
                </span>
                <span style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {!s.is_active && (
                    <button style={{ ...S.actionBtn, borderColor: "#a7f3d0", color: "#059669", background: "#ecfdf5" }}
                      onClick={() => handleActivate(s)}>
                      Activate
                    </button>
                  )}
                  <button style={{ ...S.actionBtn, borderColor: "#bae6fd", color: "#0284c7", background: "#f0f9ff" }}
                    onClick={() => openEdit(s)}>
                    Edit
                  </button>
                  <button style={{ ...S.actionBtn, borderColor: "#fecaca", color: "#dc2626", background: "#fef2f2" }}
                    disabled={deleting === s.id}
                    onClick={() => handleDelete(s.id)}>
                    {deleting === s.id ? "…" : "Delete"}
                  </button>
                </span>
              </div>
            ))
        }
      </div>
    </div>
  );
}