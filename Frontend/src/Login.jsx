import { useState, useEffect } from "react";
import { API_BASE } from "./api";

const DEMO_PERSONAS = [
  {
    role: "Student",
    icon: "🎓",
    name: "Dave Daniel",
    id: "STU-CS-2024-001",
    department: "Computer Science",
    username: "student.dave",
    password: "student123",
    tag: "3.80 GPA • Enrolled",
    accent: "#0284c7",
    accentBg: "#f0f9ff",
    accentBorder: "#bae6fd",
    textColor: "#0369a1",
  },
  {
    role: "Faculty",
    icon: "👨‍🏫",
    name: "Dr. Yared Assefa",
    id: "FAC-CS-004",
    department: "Faculty of Computing",
    username: "teacher.yada",
    password: "teacher123",
    tag: "Grade Submission",
    accent: "#059669",
    accentBg: "#ecfdf5",
    accentBorder: "#a7f3d0",
    textColor: "#047857",
  },
  {
    role: "Administration",
    icon: "🛡️",
    name: "Office of the Dean",
    id: "ADM-REG-001",
    department: "University Academic Registry",
    username: "admin",
    password: "admin123",
    tag: "System Registrar",
    accent: "#d97706",
    accentBg: "#fffbeb",
    accentBorder: "#fde68a",
    textColor: "#b45309",
  },
  {
    role: "Enrollee",
    icon: "👩‍🎓",
    name: "Ella Smith",
    id: "STU-CS-2024-002",
    department: "Freshman Intake",
    username: "student.ela",
    password: "student123",
    tag: "Registration Open",
    accent: "#7c3aed",
    accentBg: "#fdf4ff",
    accentBorder: "#f5d0fe",
    textColor: "#7e22ce",
  },
];

export default function Login({
  onLogin,
  onBackToLanding,
  initialUsername = "",
  initialPassword = "",
}) {
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState(initialPassword);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(null);

  useEffect(() => {
    setUsername(initialUsername || "");
    setError("");
    if (initialUsername) {
      const match = DEMO_PERSONAS.find((p) => p.username === initialUsername);
      if (match) setSelectedPersona(match);
    }
  }, [initialUsername]);

  useEffect(() => {
    setPassword(initialPassword || "");
  }, [initialPassword]);

  const handleLogin = async (overrideUser, overridePass) => {
    const u = overrideUser !== undefined ? overrideUser : username;
    const p = overridePass !== undefined ? overridePass : password;

    if (!u || !p) {
      setError("Please enter both university username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Authentication failed. Check your university credentials.");
      } else {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        if (onLogin) onLogin(data.access);
      }
    } catch {
      setError("Cannot reach University Authentication Service. Verify backend is running on 127.0.0.1:8000.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPersona = (persona, autoSubmit = false) => {
    setUsername(persona.username);
    setPassword(persona.password);
    setSelectedPersona(persona);
    setError("");
    if (autoSubmit) {
      handleLogin(persona.username, persona.password);
    }
  };

  return (
    <div style={styles.page}>
      {/* Decorative Ambient Glows */}
      <div style={styles.glowTop} />
      <div style={styles.glowBottom} />

      <div style={styles.gatewayContainer}>
        {/* Navigation Bar */}
        <div style={styles.topNav}>
          {onBackToLanding && (
            <button
              type="button"
              style={styles.backBtn}
              onClick={onBackToLanding}
            >
              <span>←</span>
              <span>Back to Campus Hub Overview</span>
            </button>
          )}
          <div style={styles.sessionStatus}>
            <span style={styles.pulseDot} />
            <span>Academic Session 2026/27 • Secure SSL Gateway</span>
          </div>
        </div>

        <div style={styles.grid}>
          {/* Left Column: Academic Seal & Multi-Color Demo Personas */}
          <div style={styles.leftCol}>
            <div style={styles.brandGroup}>
              <div style={styles.crestBox}>
                <span style={styles.crestIcon}>🏛️</span>
              </div>
              <div>
                <h2 style={styles.brandTitle}>CAMPUS HUB</h2>
                <div style={styles.brandSub}>University Academic Information System</div>
              </div>
            </div>

            <div style={styles.sealDescription}>
              Authorized gateway for matriculated students, academic faculty, and registry administrators. Select an official demo profile below to test any role instantly.
            </div>

            {/* Demo Personas Selector with distinct light colors */}
            <div style={styles.personaSection}>
              <div style={styles.personaSectionTitle}>
                <span>INTERACTIVE DEMO PERSONAS</span>
                <span style={styles.personaHint}>Click to autofill</span>
              </div>

              <div style={styles.personaGrid}>
                {DEMO_PERSONAS.map((p) => {
                  const isSelected = selectedPersona?.username === p.username && username === p.username;
                  return (
                    <div
                      key={p.username}
                      style={{
                        ...styles.personaCard,
                        borderColor: isSelected ? p.accent : p.accentBorder,
                        background: isSelected ? p.accentBg : "#ffffff",
                        boxShadow: isSelected ? `0 4px 14px ${p.accent}25` : "0 1px 3px rgba(0,0,0,0.04)",
                      }}
                      onClick={() => handleSelectPersona(p, false)}
                    >
                      <div style={styles.personaCardTop}>
                        <span style={styles.personaIcon}>{p.icon}</span>
                        <span
                          style={{
                            ...styles.personaRoleBadge,
                            color: p.textColor,
                            background: p.accentBg,
                            border: `1px solid ${p.accentBorder}`,
                          }}
                        >
                          {p.role}
                        </span>
                      </div>
                      <div style={{ ...styles.personaName, color: p.textColor }}>{p.name}</div>
                      <div style={styles.personaDept}>{p.department}</div>
                      <div style={styles.personaBottom}>
                        <code style={{ ...styles.personaCode, color: p.textColor, background: p.accentBg }}>
                          {p.username}
                        </code>
                        <span style={{ ...styles.personaTag, color: p.textColor }}>{p.tag}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={styles.securityNotice}>
              <span style={{ fontSize: "14px" }}>🔒</span>
              <span>Encrypted 256-bit token authentication powered by Django Academic Registry</span>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div style={styles.rightCol}>
            <div style={styles.authCard}>
              <div style={styles.cardHeader}>
                <h1 style={styles.authTitle}>Sign In to Portal</h1>
                <p style={styles.authSubtitle}>
                  Enter your assigned campus credentials to access your dashboard
                </p>
              </div>

              {selectedPersona && username === selectedPersona.username && (
                <div
                  style={{
                    ...styles.activePersonaBadge,
                    borderColor: selectedPersona.accentBorder,
                    background: selectedPersona.accentBg,
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{selectedPersona.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: selectedPersona.textColor }}>
                      Credentials Loaded: {selectedPersona.name}
                    </div>
                    <div style={{ fontSize: "11px", color: selectedPersona.textColor, opacity: 0.85 }}>
                      Role: {selectedPersona.role} • ID: {selectedPersona.id}
                    </div>
                  </div>
                  <button
                    type="button"
                    style={{
                      ...styles.quickLoginBtn,
                      background: selectedPersona.accent,
                    }}
                    onClick={() => handleLogin(selectedPersona.username, selectedPersona.password)}
                  >
                    Quick In →
                  </button>
                </div>
              )}

              <form
                style={styles.form}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                <div style={styles.field}>
                  <label style={styles.label}>
                    <span>University ID or Username</span>
                    <span style={styles.labelHint}>e.g. student.dave, admin</span>
                  </label>
                  <div style={styles.inputWrap}>
                    <span style={styles.inputIcon}>👤</span>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="Username or Staff/Student ID"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setSelectedPersona(DEMO_PERSONAS.find((p) => p.username === e.target.value) || null);
                      }}
                      autoFocus
                    />
                  </div>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>
                    <span>Account Password</span>
                    <span style={styles.labelHint}>Default: student123 / admin123</span>
                  </label>
                  <div style={styles.inputWrap}>
                    <span style={styles.inputIcon}>🔑</span>
                    <input
                      style={{ ...styles.input, paddingRight: "46px" }}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      style={styles.eyeBtn}
                      onClick={() => setShowPassword((p) => !p)}
                      tabIndex={-1}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div style={styles.errorBox}>
                    <span style={{ fontSize: "15px" }}>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    ...styles.submitBtn,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "wait" : "pointer",
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <span>Authenticating Registry Access…</span>
                  ) : (
                    <span>Sign In to Academic Portal →</span>
                  )}
                </button>
              </form>

              <div style={styles.cardFooter}>
                <div style={styles.footerNote}>
                  Default Password for all student and faculty demo accounts: <code>student123</code> or <code>teacher123</code>. Admin: <code>admin123</code>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    color: "#0f172a",
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1.5rem",
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  glowTop: {
    position: "absolute",
    top: "-150px",
    left: "15%",
    width: "600px",
    height: "500px",
    background: "radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  glowBottom: {
    position: "absolute",
    bottom: "-150px",
    right: "15%",
    width: "600px",
    height: "500px",
    background: "radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  gatewayContainer: {
    width: "100%",
    maxWidth: "1040px",
    position: "relative",
    zIndex: 10,
  },
  topNav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    gap: "10px",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 0",
    transition: "color 0.15s ease",
  },
  sessionStatus: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500",
  },
  pulseDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#2563eb",
    boxShadow: "0 0 8px #60a5fa",
    display: "inline-block",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 1fr",
    gap: "0",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
    overflow: "hidden",
  },
  leftCol: {
    padding: "2.75rem 2.5rem",
    background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
    borderRight: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "1.75rem",
  },
  brandGroup: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  crestBox: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
    border: "1px solid rgba(37, 99, 235, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)",
    flexShrink: 0,
  },
  crestIcon: {
    fontSize: "24px",
  },
  brandTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "800",
    letterSpacing: "0.06em",
    color: "#0f172a",
  },
  brandSub: {
    fontSize: "11px",
    color: "#2563eb",
    fontWeight: "700",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    marginTop: "2px",
  },
  sealDescription: {
    fontSize: "13px",
    lineHeight: 1.6,
    color: "#475569",
  },
  personaSection: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  personaSectionTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.06em",
    color: "#64748b",
  },
  personaHint: {
    color: "#2563eb",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "none",
  },
  personaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  personaCard: {
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1.5px solid",
    cursor: "pointer",
    transition: "all 0.15s ease",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  personaCardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  personaIcon: {
    fontSize: "18px",
  },
  personaRoleBadge: {
    fontSize: "10px",
    fontWeight: "700",
    padding: "2px 8px",
    borderRadius: "12px",
  },
  personaName: {
    fontSize: "13px",
    fontWeight: "700",
    marginTop: "2px",
  },
  personaDept: {
    fontSize: "11px",
    color: "#64748b",
  },
  personaBottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "6px",
    paddingTop: "6px",
    borderTop: "1px solid rgba(0, 0, 0, 0.05)",
  },
  personaCode: {
    fontFamily: "monospace",
    fontSize: "10px",
    padding: "1px 5px",
    borderRadius: "4px",
    fontWeight: "600",
  },
  personaTag: {
    fontSize: "10px",
    fontWeight: "700",
  },
  securityNotice: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "11px",
    color: "#64748b",
    lineHeight: 1.4,
  },
  rightCol: {
    padding: "2.75rem 2.5rem",
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  authCard: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  cardHeader: {
    marginBottom: "0.25rem",
  },
  authTitle: {
    margin: "0 0 6px",
    fontSize: "24px",
    fontWeight: "800",
    letterSpacing: "-0.3px",
    color: "#0f172a",
  },
  authSubtitle: {
    margin: 0,
    fontSize: "13px",
    color: "#64748b",
  },
  activePersonaBadge: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1.5px solid",
  },
  quickLoginBtn: {
    border: "none",
    borderRadius: "8px",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "11px",
    padding: "6px 12px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "12px",
    fontWeight: "700",
    color: "#1e293b",
  },
  labelHint: {
    fontSize: "11px",
    color: "#64748b",
    fontWeight: "400",
  },
  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    fontSize: "14px",
    pointerEvents: "none",
    opacity: 0.6,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "#f8fafc",
    border: "1.5px solid #cbd5e1",
    borderRadius: "12px",
    padding: "12px 14px 12px 42px",
    color: "#0f172a",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px",
    lineHeight: 1,
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "#dc2626",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    lineHeight: 1.4,
    fontWeight: "600",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    border: "none",
    borderRadius: "12px",
    padding: "13px 18px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.02em",
    boxShadow: "0 4px 16px rgba(37, 99, 235, 0.35)",
    transition: "all 0.15s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
    marginTop: "4px",
  },
  cardFooter: {
    paddingTop: "0.75rem",
    borderTop: "1px solid #f1f5f9",
  },
  footerNote: {
    fontSize: "11px",
    color: "#64748b",
    lineHeight: 1.5,
    textAlign: "center",
  },
};
