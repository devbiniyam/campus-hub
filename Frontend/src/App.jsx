import { useState, useEffect } from "react";
import { parseToken, apiFetch, demoLogin } from "./api";
import LandingPage from "./LandingPage";
import Login from "./Login";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";
import AdminDashboard from "./AdminDashboard";
import RegistrationPage from "./RegistrationPage";
import GradeSubmissionPage from "./GradeSubmissionPage";
import CoursesPage from "./CoursesPage";
import ProfilePage from "./ProfilePage";
import SemesterManagementPage from "./SemesterManagementPage";
import UserManagementPage from "./UserManagementPage";
import SectionManagementPage from "./SectionManagementPage";
import CourseAssignmentPage from "./CourseAssignmentPage";
import DormitoryManagementPage from "./DormitoryManagementPage";
import GradesHistoryPage from "./GradesHistoryPage";
import StudentStatusPage from "./StudentStatusPage";

const NAV = {
  STUDENT: [
    { key: "dashboard",    label: "Dashboard",       icon: "⊞" },
    { key: "registration", label: "Registration",    icon: "✎" },
    { key: "grades",       label: "My Grades",       icon: "◈" },
    { key: "courses",      label: "Courses",         icon: "◫" },
    { key: "profile",      label: "My Profile",      icon: "◉" },
  ],
  TEACHER: [
    { key: "dashboard",    label: "Dashboard",       icon: "⊞" },
    { key: "gradesubmit",  label: "Grade Submission", icon: "✎" },
    { key: "studentstatus",label: "Student Status",  icon: "◈" },
    { key: "courses",      label: "Courses",         icon: "◫" },
    { key: "profile",      label: "My Profile",      icon: "◉" },
  ],
  ADMIN: [
    { key: "dashboard",    label: "Dashboard",       icon: "⊞" },
    { key: "users",        label: "User Accounts",   icon: "◉" },
    { key: "semesters",    label: "Semesters",       icon: "◫" },
    { key: "sections",     label: "Sections",        icon: "◈" },
    { key: "courseassign", label: "Course Assign",   icon: "✎" },
    { key: "dormitories",  label: "Dormitories",     icon: "⊟" },
    { key: "courses",      label: "Courses",         icon: "⊞" },
    { key: "profile",      label: "My Profile",      icon: "◉" },
  ],
};

const ROLE_COLOR = {
  STUDENT: "#0284c7",
  TEACHER: "#059669",
  ADMIN:   "#d97706",
};

const PAGE_TITLES = {
  dashboard:     "Dashboard Overview",
  registration:  "Course Registration",
  grades:        "Academic Grade History",
  gradesubmit:   "Grade Submission & Marks",
  studentstatus: "Student Standing & GPA Status",
  courses:       "Course Catalog & Departments",
  profile:       "User Account Profile",
  semesters:     "Academic Semester Management",
  users:         "University User Management",
  sections:      "Class Section Management",
  courseassign:  "Faculty Course Assignments",
  dormitories:   "Dormitory & Room Management",
};

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("access_token"));
  const [view, setView] = useState("landing"); // "landing" | "login"
  const [page, setPage] = useState("dashboard");
  const [profile, setProfile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const payload = token ? parseToken(token) : null;
  const role = payload?.role || "STUDENT";
  const roleColor = ROLE_COLOR[role] || "#38bdf8";

  useEffect(() => {
    if (token) {
      apiFetch("/users/me/")
        .then((r) => r.ok && r.json())
        .then((d) => d && setProfile(d))
        .catch(() => {});
    }
  }, [token]);

  const handleDemoSwitch = async (username, password) => {
    try {
      const data = await demoLogin(username, password);
      setToken(data.access);
      setPage("dashboard");
      setSidebarOpen(false);
    } catch (err) {
      alert(err.message || "Failed to switch demo account.");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setToken(null);
    setProfile(null);
    setView("landing");
  };

  const [demoUser, setDemoUser] = useState("");
  const [demoPass, setDemoPass] = useState("");

  const handleLaunchPortal = () => {
    setDemoUser("");
    setDemoPass("");
    setView("login");
  };

  const handleSelectDemoFromLanding = (username, password) => {
    setDemoUser(username);
    setDemoPass(password);
    setView("login");
  };

  // If not logged in, display LandingPage or Login view
  if (!token) {
    if (view === "login") {
      return (
        <Login
          initialUsername={demoUser}
          initialPassword={demoPass}
          onLogin={(t) => {
            setToken(t);
            setPage("dashboard");
          }}
          onBackToLanding={() => setView("landing")}
          onSelectDemo={handleDemoSwitch}
        />
      );
    }
    return (
      <LandingPage
        onLaunchPortal={handleLaunchPortal}
        onSelectDemo={handleSelectDemoFromLanding}
      />
    );
  }

  const navItems = NAV[role] || NAV.STUDENT;
  const initials = profile
    ? `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`
    : "?";

  return (
    <div style={S.app}>
      {/* Sidebar */}
      <aside
        style={{
          ...S.sidebar,
          ...(sidebarOpen ? S.sidebarOpenMobile : {}),
        }}
      >
        <div style={S.sideTop}>
          <div style={S.logoMark}>🏛️</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={S.brandName}>Campus Hub</span>
            <span style={S.brandTag}>ACADEMIC REGISTRY</span>
          </div>
          {/* Close button on mobile */}
          <button
            style={S.closeMobileBtn}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <nav style={S.nav}>
          {navItems.map((item) => {
            const isActive = page === item.key;
            return (
              <button
                key={item.key}
                style={{
                  ...S.navItem,
                  ...(isActive ? S.navItemActive : {}),
                }}
                onClick={() => {
                  setPage(item.key);
                  setSidebarOpen(false);
                }}
              >
                <span
                  style={{
                    ...S.navIcon,
                    color: isActive ? "#2563eb" : "#64748b",
                  }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={S.sideBottom}>
          <div style={S.userRow}>
            <div
              style={{
                ...S.avatar,
                background: `${roleColor}22`,
                color: roleColor,
                border: `1px solid ${roleColor}55`,
              }}
            >
              {initials}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={S.userName}>
                {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : payload?.username}
              </div>
              <div style={{ ...S.userRole, color: roleColor }}>{role}</div>
            </div>
            <button
              style={S.logoutBtn}
              title="Sign out to landing page"
              onClick={handleSignOut}
            >
              ⏻
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          style={S.backdrop}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div style={S.main}>
        {/* Top In-App Interactive Demo Switcher Bar */}
        <div style={S.demoSwitcherBar} className="app-demo-switcher">
          <div style={S.demoSwitcherInner} className="app-demo-switcher-inner">
            <div style={S.demoSwitcherInfo} className="app-demo-switcher-info">
              <span style={{ fontSize: "14px" }}>🏛️</span>
              <span style={S.demoSwitcherTitle}>Academic Sandbox:</span>
              <span style={S.demoCurrentRole}>
                Logged in as <strong>{payload?.username}</strong> ({role})
              </span>
            </div>
            <div style={S.demoSwitcherButtons} className="app-demo-buttons">
              <button
                type="button"
                style={{
                  ...S.switcherPill,
                  ...(payload?.username === "student.dave" ? S.switcherPillActiveStudent : {}),
                }}
                onClick={() => handleDemoSwitch("student.dave", "student123")}
                title="Switch to Student Dave Daniel (CS Enrolled)"
              >
                🎓 Dave (Student)
              </button>
              <button
                type="button"
                style={{
                  ...S.switcherPill,
                  ...(payload?.username === "student.ela" ? S.switcherPillActiveElla : {}),
                }}
                onClick={() => handleDemoSwitch("student.ela", "student123")}
                title="Switch to Ella Smith (Pending Registration)"
              >
                👩‍🎓 Ella (Enrollee)
              </button>
              <button
                type="button"
                style={{
                  ...S.switcherPill,
                  ...(role === "TEACHER" ? S.switcherPillActiveTeacher : {}),
                }}
                onClick={() => handleDemoSwitch("teacher.yada", "teacher123")}
                title="Switch to Teacher Dr. Yared Assefa (Faculty)"
              >
                👨‍🏫 Dr. Yared (Faculty)
              </button>
              <button
                type="button"
                style={{
                  ...S.switcherPill,
                  ...(role === "ADMIN" ? S.switcherPillActiveAdmin : {}),
                }}
                onClick={() => handleDemoSwitch("admin", "admin123")}
                title="Switch to Dean Administrator"
              >
                🛡️ Dean (Admin)
              </button>
            </div>
          </div>
        </div>

        {/* Header Topbar */}
        <header style={S.topbar} className="app-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              style={S.hamburgerBtn}
              onClick={() => setSidebarOpen((s) => !s)}
              aria-label="Toggle navigation"
            >
              ☰
            </button>
            <div>
              <h2 style={S.pageTitle} className="app-page-title">{PAGE_TITLES[page] || "Dashboard"}</h2>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={S.termBadge} className="app-term-badge">
              <span style={S.termDot} />
              Term 2026/27 • Active
            </span>
            <span
              style={{
                ...S.roleBadge,
                background: `${roleColor}18`,
                color: roleColor,
                border: `1px solid ${roleColor}44`,
              }}
            >
              ● {role}
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main style={S.content} className="app-content">
          {/* STUDENT */}
          {page === "dashboard"    && role === "STUDENT" && <StudentDashboard user={payload} />}
          {page === "registration" && role === "STUDENT" && <RegistrationPage />}
          {page === "grades"       && role === "STUDENT" && <GradesHistoryPage />}

          {/* TEACHER */}
          {page === "dashboard"     && role === "TEACHER" && <TeacherDashboard user={payload} />}
          {page === "gradesubmit"   && role === "TEACHER" && <GradeSubmissionPage />}
          {page === "studentstatus" && role === "TEACHER" && <StudentStatusPage />}

          {/* ADMIN */}
          {page === "dashboard"    && role === "ADMIN" && <AdminDashboard user={payload} />}
          {page === "users"        && role === "ADMIN" && <UserManagementPage />}
          {page === "semesters"    && role === "ADMIN" && <SemesterManagementPage />}
          {page === "sections"     && role === "ADMIN" && <SectionManagementPage />}
          {page === "courseassign" && role === "ADMIN" && <CourseAssignmentPage />}
          {page === "dormitories"  && role === "ADMIN" && <DormitoryManagementPage />}

          {/* SHARED */}
          {page === "courses" && <CoursesPage role={role} />}
          {page === "profile" && <ProfilePage />}
        </main>
      </div>
    </div>
  );
}

const S = {
  app: {
    display: "flex",
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#0f172a",
  },
  sidebar: {
    width: "248px",
    flexShrink: 0,
    background: "#ffffff",
    borderRight: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.25s ease",
    zIndex: 50,
  },
  sidebarOpenMobile: {
    transform: "translateX(0) !important",
  },
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(15, 23, 42, 0.45)",
    backdropFilter: "blur(4px)",
    zIndex: 40,
  },
  closeMobileBtn: {
    display: "none",
    background: "none",
    border: "none",
    color: "#64748b",
    fontSize: "18px",
    cursor: "pointer",
    marginLeft: "auto",
  },
  hamburgerBtn: {
    display: "none",
    background: "none",
    border: "none",
    color: "#0f172a",
    fontSize: "20px",
    cursor: "pointer",
    padding: "4px",
  },
  sideTop: {
    padding: "1.25rem 1.15rem",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoMark: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
    border: "1px solid rgba(37, 99, 235, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0,
    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.2)",
  },
  brandName: {
    fontWeight: "800",
    fontSize: "15px",
    color: "#0f172a",
    letterSpacing: "-0.2px",
  },
  brandTag: {
    fontSize: "9px",
    color: "#0284c7",
    fontWeight: "700",
    letterSpacing: "0.08em",
  },
  nav: {
    flex: 1,
    padding: "1rem 0.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    overflowY: "auto",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 12px",
    borderRadius: "10px",
    fontSize: "13px",
    color: "#475569",
    cursor: "pointer",
    border: "none",
    background: "transparent",
    width: "100%",
    textAlign: "left",
    transition: "background 0.15s ease, color 0.15s ease",
    fontWeight: "500",
    fontFamily: "'DM Sans', sans-serif",
  },
  navItemActive: {
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: "600",
    borderLeft: "3px solid #2563eb",
    borderRadius: "0 10px 10px 0",
  },
  navIcon: {
    fontSize: "15px",
    width: "20px",
    textAlign: "center",
    display: "inline-block",
  },
  sideBottom: {
    padding: "0.85rem 0.75rem",
    borderTop: "1px solid #e2e8f0",
  },
  userRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 10px",
    borderRadius: "10px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "700",
    flexShrink: 0,
  },
  userName: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#0f172a",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  userRole: {
    fontSize: "10px",
    fontWeight: "600",
    marginTop: "1px",
  },
  logoutBtn: {
    background: "none",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px",
    lineHeight: 1,
    transition: "color 0.15s ease",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    background: "#f8fafc",
  },
  demoSwitcherBar: {
    background: "linear-gradient(90deg, #ecfdf5 0%, #f0f9ff 45%, #fffbeb 85%, #fdf4ff 100%)",
    borderBottom: "1px solid #e2e8f0",
    padding: "7px 1.5rem",
  },
  demoSwitcherInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
  },
  demoSwitcherInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
  },
  demoSwitcherTitle: {
    fontWeight: "700",
    color: "#0f172a",
  },
  demoCurrentRole: {
    color: "#475569",
  },
  demoSwitcherButtons: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexWrap: "wrap",
  },
  switcherPill: {
    padding: "4px 10px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#475569",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.15s ease",
    fontFamily: "'DM Sans', sans-serif",
  },
  switcherPillActiveStudent: {
    background: "#e0f2fe",
    borderColor: "#0284c7",
    color: "#0369a1",
  },
  switcherPillActiveElla: {
    background: "#fdf4ff",
    borderColor: "#c026d3",
    color: "#a21caf",
  },
  switcherPillActiveTeacher: {
    background: "#ecfdf5",
    borderColor: "#059669",
    color: "#047857",
  },
  switcherPillActiveAdmin: {
    background: "#fffbeb",
    borderColor: "#d97706",
    color: "#b45309",
  },
  topbar: {
    padding: "0.85rem 1.5rem",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(12px)",
  },
  pageTitle: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.2px",
  },
  termBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    color: "#334155",
    background: "#f1f5f9",
    border: "1px solid #cbd5e1",
    borderRadius: "20px",
    padding: "3px 10px",
    fontWeight: "600",
  },
  termDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#10b981",
  },
  roleBadge: {
    fontSize: "11px",
    padding: "4px 12px",
    borderRadius: "20px",
    fontWeight: "700",
    letterSpacing: "0.04em",
  },
  content: {
    flex: 1,
    padding: "1.5rem",
    overflowY: "auto",
    background: "#f8fafc",
  },
};
