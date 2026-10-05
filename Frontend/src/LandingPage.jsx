import React, { useState } from "react";

export default function LandingPage({ onLaunchPortal, onSelectDemo }) {
  const [activeHeroTab, setActiveHeroTab] = useState("transcript");
  const [activeDept, setActiveDept] = useState("CS");
  const [calcScore, setCalcScore] = useState(87);
  const [calcUnits, setCalcUnits] = useState(4);

  // Grade point mapping with rich, high-contrast light colors
  const calculateStanding = (score) => {
    const s = Number(score) || 0;
    if (s >= 90) return { grade: "A+", gpa: "4.00", honor: "Dean's High Honors", status: "ACTIVE", tone: "#0284c7" };
    if (s >= 85) return { grade: "A", gpa: "4.00", honor: "Dean's Honors", status: "ACTIVE", tone: "#0284c7" };
    if (s >= 80) return { grade: "A-", gpa: "3.75", honor: "First Class Standing", status: "ACTIVE", tone: "#2563eb" };
    if (s >= 75) return { grade: "B+", gpa: "3.50", honor: "Good Standing", status: "ACTIVE", tone: "#2563eb" };
    if (s >= 70) return { grade: "B", gpa: "3.00", honor: "Satisfactory", status: "ACTIVE", tone: "#4f46e5" };
    if (s >= 65) return { grade: "B-", gpa: "2.75", honor: "Satisfactory", status: "ACTIVE", tone: "#4f46e5" };
    if (s >= 60) return { grade: "C+", gpa: "2.50", honor: "Academic Warning", status: "ACTIVE", tone: "#d97706" };
    if (s >= 50) return { grade: "C", gpa: "2.00", honor: "Minimum Passing", status: "ACTIVE", tone: "#d97706" };
    if (s >= 45) return { grade: "C-", gpa: "1.75", honor: "Academic Probation", status: "PROBATION", tone: "#ea580c" };
    if (s >= 40) return { grade: "D", gpa: "1.00", honor: "Dismissal Warning", status: "DISMISSED", tone: "#dc2626" };
    return { grade: "F", gpa: "0.00", honor: "Failed Unit", status: "DISMISSED", tone: "#dc2626" };
  };

  const standing = calculateStanding(calcScore);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const departments = {
    CS: {
      name: "Computer Science",
      code: "CS",
      head: "Prof. Alan Vance",
      faculty: 12,
      accent: "#0284c7",
      bg: "#f0f9ff",
      border: "#bae6fd",
      courses: [
        { code: "CS101", title: "Data Structures & Algorithm Complexity", units: 3, status: "Enrolling" },
        { code: "CS201", title: "Relational Database Design & Distributed SQL", units: 3, status: "Enrolling" },
        { code: "CS301", title: "Network Protocols & Cyber Defense", units: 3, status: "Active" },
        { code: "CS401", title: "Operating Systems Kernel Architecture", units: 4, status: "Active" },
      ],
    },
    SE: {
      name: "Software Engineering",
      code: "SE",
      head: "Dr. Rachel Ward",
      faculty: 9,
      accent: "#7c3aed",
      bg: "#f5f3ff",
      border: "#ddd6fe",
      courses: [
        { code: "SE101", title: "Software Architecture & System Patterns", units: 3, status: "Enrolling" },
        { code: "SE201", title: "Full-Stack Enterprise Cloud Engineering", units: 3, status: "Enrolling" },
        { code: "SE302", title: "Microservices & Distributed Systems", units: 3, status: "Planned" },
      ],
    },
    IT: {
      name: "Information Technology",
      code: "IT",
      head: "Dr. Marcus Lin",
      faculty: 8,
      accent: "#0d9488",
      bg: "#f0fdfa",
      border: "#99f6e4",
      courses: [
        { code: "IT101", title: "Cloud Infrastructure, Kubernetes & DevOps", units: 3, status: "Enrolling" },
        { code: "IT202", title: "Enterprise Systems Administration", units: 3, status: "Active" },
      ],
    },
    EE: {
      name: "Electrical Engineering",
      code: "EE",
      head: "Dr. Elena Rostova",
      faculty: 11,
      accent: "#d97706",
      bg: "#fffbeb",
      border: "#fde68a",
      courses: [
        { code: "EE101", title: "Digital Logic Design & Microprocessors", units: 4, status: "Active" },
        { code: "EE205", title: "Embedded Systems & Signal Processing", units: 4, status: "Enrolling" },
      ],
    },
  };

  return (
    <div style={T.page}>
      {/* Top Academic Navigation Bar */}
      <header style={T.header}>
        <div style={T.headerInner} className="landing-header-inner">
          <div style={T.brandGroup} onClick={() => scrollTo("top")} role="button" tabIndex={0}>
            <div style={T.crestIcon}>
              <span style={T.crestSymbol}>🏛️</span>
            </div>
            <div>
              <div style={T.brandTitle}>CAMPUS HUB</div>
              <div style={T.brandSubtitle} className="landing-brand-subtitle">Higher Education Academic Registry</div>
            </div>
          </div>

          <nav style={T.navMenu} className="landing-nav-menu">
            <button style={T.navLink} onClick={() => scrollTo("curriculum")}>Curriculum</button>
            <button style={T.navLink} onClick={() => scrollTo("operations")}>Academic Lifecycle</button>
            <button style={T.navLink} onClick={() => scrollTo("evaluator")}>GPA Simulator</button>
            <button style={T.navLink} onClick={() => scrollTo("credentials")}>Demo Access</button>
          </nav>

          <div style={T.headerActions} className="landing-header-actions">
            <button style={T.btnNavSecondary} className="landing-btn-signin" onClick={() => onLaunchPortal("login")}>
              Sign In
            </button>
            <button style={T.btnNavPrimary} onClick={() => onLaunchPortal("login")}>
              Launch Portal →
            </button>
          </div>
        </div>
      </header>

      {/* Main Dual-Column Hero Showcase */}
      <section style={T.heroSection} className="landing-hero-section" id="top">
        <div style={T.heroGrid} className="landing-hero-grid">
          {/* Left Column: Mission & Credentials */}
          <div style={T.heroLeft}>
            <div style={T.statusTag}>
              <span style={T.pulseDot}></span>
              <span>ACADEMIC TERM 2026/27 • REGISTRY ACTIVE</span>
            </div>

            <h1 style={T.heroHeading} className="landing-hero-heading">
              The Unified <br />
              <span style={T.heroHeadingAccent}>Academic Operating System</span> <br />
              for Modern Universities
            </h1>

            <p style={T.heroText} className="landing-hero-text">
              A rigorous student information platform engineered for academic governance.
              Enforcing semester registration checkpoints, faculty mark submissions, automated
              GPA & probation engines, and capacity-locked dormitory allocations with absolute database integrity.
            </p>

            <div style={T.heroButtonGroup} className="landing-hero-btn-group">
              <button style={T.heroPrimaryBtn} onClick={() => onLaunchPortal("login")}>
                Enter Campus Portal
              </button>
              <button style={T.heroSecondaryBtn} onClick={() => scrollTo("credentials")}>
                View Demo Passes ↓
              </button>
            </div>

            {/* University Access Credentials Card */}
            <div style={T.accessCard} id="credentials">
              <div style={T.accessCardHeader}>
                <span style={T.accessCardTitle}>⚡ Quick Demo Role Selection</span>
                <span style={T.accessCardNote}>Pre-fills credentials on Sign In</span>
              </div>

              <div style={T.roleGrid} className="landing-role-grid">
                <div
                  style={{
                    ...T.rolePill,
                    background: "#f0f9ff",
                    border: "1px solid #bae6fd",
                  }}
                  onClick={() => onSelectDemo("student.dave", "student123")}
                  role="button"
                  tabIndex={0}
                >
                  <div style={T.rolePillIcon}>🎓</div>
                  <div>
                    <div style={{ ...T.rolePillName, color: "#0284c7" }}>Dave Daniel (Student)</div>
                    <div style={T.rolePillMeta}>CS Major • 3.80 Cumulative GPA</div>
                  </div>
                </div>

                <div
                  style={{
                    ...T.rolePill,
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                  }}
                  onClick={() => onSelectDemo("teacher.yada", "teacher123")}
                  role="button"
                  tabIndex={0}
                >
                  <div style={T.rolePillIcon}>👨‍🏫</div>
                  <div>
                    <div style={{ ...T.rolePillName, color: "#059669" }}>Dr. Yared Assefa (Faculty)</div>
                    <div style={T.rolePillMeta}>Senior Lecturer • CS Department</div>
                  </div>
                </div>

                <div
                  style={{
                    ...T.rolePill,
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                  }}
                  onClick={() => onSelectDemo("admin", "admin123")}
                  role="button"
                  tabIndex={0}
                >
                  <div style={T.rolePillIcon}>🛡️</div>
                  <div>
                    <div style={{ ...T.rolePillName, color: "#b45309" }}>Dean Administrator (Registrar)</div>
                    <div style={T.rolePillMeta}>Dean of Admissions & Approvals</div>
                  </div>
                </div>

                <div
                  style={{
                    ...T.rolePill,
                    background: "#fdf4ff",
                    border: "1px solid #f5d0fe",
                  }}
                  onClick={() => onSelectDemo("student.ela", "student123")}
                  role="button"
                  tabIndex={0}
                >
                  <div style={T.rolePillIcon}>👩‍🎓</div>
                  <div>
                    <div style={{ ...T.rolePillName, color: "#7e22ce" }}>Ella Smith (Applicant)</div>
                    <div style={T.rolePillMeta}>SE Major • Pending Approval Tester</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Campus Terminal Preview */}
          <div style={T.heroRight}>
            <div style={T.terminalWindow}>
              {/* Window Titlebar */}
              <div style={T.terminalTitlebar}>
                <div style={T.windowDots}>
                  <span style={{ ...T.wDot, background: "#ef4444" }}></span>
                  <span style={{ ...T.wDot, background: "#f59e0b" }}></span>
                  <span style={{ ...T.wDot, background: "#10b981" }}></span>
                </div>
                <div style={T.windowTitle}>campus-hub://live-registry-preview</div>
                <div style={T.windowStatusBadge}>CONNECTED</div>
              </div>

              {/* View Selector Tabs */}
              <div style={T.terminalTabs}>
                <button
                  style={{ ...T.termTab, ...(activeHeroTab === "transcript" ? T.termTabActive : {}) }}
                  onClick={() => setActiveHeroTab("transcript")}
                >
                  Transcript & GPA
                </button>
                <button
                  style={{ ...T.termTab, ...(activeHeroTab === "registration" ? T.termTabActive : {}) }}
                  onClick={() => setActiveHeroTab("registration")}
                >
                  Term Registration
                </button>
                <button
                  style={{ ...T.termTab, ...(activeHeroTab === "dorm" ? T.termTabActive : {}) }}
                  onClick={() => setActiveHeroTab("dorm")}
                >
                  Dorm Matrix
                </button>
              </div>

              {/* Window Content Display */}
              <div style={T.terminalBody}>
                {activeHeroTab === "transcript" && (
                  <div>
                    <div style={T.transcriptUserBar}>
                      <div>
                        <div style={T.tUserName}>Dave Daniel • Student ID STU-CS-2024-001</div>
                        <div style={T.tUserDept}>B.S. in Computer Science • Year 2 • Section A</div>
                      </div>
                      <div style={T.tHonorBadge}>DEAN'S LIST</div>
                    </div>

                    <div style={T.tMetricsRow} className="landing-t-metrics-row">
                      <div style={{ ...T.tMetricBox, background: "#f0f9ff", border: "1px solid #bae6fd" }}>
                        <div style={{ ...T.tMetricNum, color: "#0284c7" }}>4.00</div>
                        <div style={T.tMetricLabel}>Semester GPA</div>
                      </div>
                      <div style={{ ...T.tMetricBox, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                        <div style={{ ...T.tMetricNum, color: "#2563eb" }}>3.80</div>
                        <div style={T.tMetricLabel}>Cumulative GPA</div>
                      </div>
                      <div style={{ ...T.tMetricBox, background: "#ecfdf5", border: "1px solid #a7f3d0" }}>
                        <div style={{ ...T.tMetricNum, color: "#059669" }}>18.0</div>
                        <div style={T.tMetricLabel}>Credits Earned</div>
                      </div>
                    </div>

                    <div style={T.tCourseTable} className="landing-t-course-table">
                      <div style={T.tTableHead}>
                        <span>Course</span>
                        <span>Units</span>
                        <span>Marks</span>
                        <span>Grade</span>
                      </div>
                      <div style={T.tTableRow}>
                        <span>CS101 Algorithm Complexity</span>
                        <span>3</span>
                        <span>92%</span>
                        <span style={{ color: "#0284c7", fontWeight: "700" }}>A+</span>
                      </div>
                      <div style={T.tTableRow}>
                        <span>CS201 Relational Database Systems</span>
                        <span>3</span>
                        <span>88%</span>
                        <span style={{ color: "#0284c7", fontWeight: "700" }}>A</span>
                      </div>
                      <div style={T.tTableRow}>
                        <span>CS301 Network Protocols & Security</span>
                        <span>3</span>
                        <span>84%</span>
                        <span style={{ color: "#2563eb", fontWeight: "700" }}>A-</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeHeroTab === "registration" && (
                  <div>
                    <div style={T.transcriptUserBar}>
                      <div>
                        <div style={T.tUserName}>Fall 2026/27 Course Enrollment</div>
                        <div style={T.tUserDept}>3 Enrolled Units • Dean Approval Pending</div>
                      </div>
                      <span style={{ ...T.tHonorBadge, background: "#fffbeb", color: "#b45309", borderColor: "#fde68a" }}>
                        GATEWAY ACTIVE
                      </span>
                    </div>

                    <div style={T.workflowList}>
                      <div style={{ ...T.workflowStep, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                        <div style={{ ...T.wfNumber, background: "#dbeafe", color: "#1d4ed8" }}>1</div>
                        <div style={T.wfContent}>
                          <div style={{ ...T.wfTitle, color: "#1d4ed8" }}>Course Selection & Prerequisite Validation</div>
                          <div style={T.wfDesc}>Passed all prerequisites (CS101 completed with grade A+)</div>
                        </div>
                        <div style={T.wfCheck}>✓</div>
                      </div>
                      <div style={{ ...T.workflowStep, background: "#ecfdf5", border: "1px solid #a7f3d0" }}>
                        <div style={{ ...T.wfNumber, background: "#d1fae5", color: "#047857" }}>2</div>
                        <div style={T.wfContent}>
                          <div style={{ ...T.wfTitle, color: "#047857" }}>Capacity & Section Locking</div>
                          <div style={T.wfDesc}>Section CS-A reserved (Capacity 40 / 40 guaranteed)</div>
                        </div>
                        <div style={T.wfCheck}>✓</div>
                      </div>
                      <div style={{ ...T.workflowStep, background: "#fffbeb", border: "1px solid #fde68a" }}>
                        <div style={{ ...T.wfNumber, background: "#fef3c7", color: "#b45309" }}>3</div>
                        <div style={T.wfContent}>
                          <div style={{ ...T.wfTitle, color: "#b45309" }}>Registrar Dean Authorization</div>
                          <div style={T.wfDesc}>Approval atomically issues enrollments and syncs class rosters</div>
                        </div>
                        <div style={{ ...T.wfCheck, background: "#fef3c7", color: "#b45309" }}>⚡</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeHeroTab === "dorm" && (
                  <div>
                    <div style={T.transcriptUserBar}>
                      <div>
                        <div style={T.tUserName}>Campus Dormitory Allocation Engine</div>
                        <div style={T.tUserDept}>Gender-restricted, capacity-guarded room assignments</div>
                      </div>
                      <span style={{ ...T.tHonorBadge, background: "#fffbeb", color: "#b45309", borderColor: "#fde68a" }}>
                        CAPACITY SAFEGUARD
                      </span>
                    </div>

                    <div style={T.dormGrid} className="landing-dorm-grid">
                      <div style={{ ...T.dormBox, background: "#f0f9ff", border: "1px solid #bae6fd" }}>
                        <div style={T.dormHeader}>
                          <span style={{ color: "#0284c7" }}>Block 1 (Male Residence)</span>
                          <span style={T.dormBadge}>4 / 4 Cap</span>
                        </div>
                        <div style={T.dormRoomRow}>
                          <span style={{ color: "#334155", fontWeight: "600" }}>Room 101</span>
                          <span style={{ color: "#0284c7", fontWeight: "700" }}>Assigned: Dave Daniel + 3</span>
                        </div>
                        <div style={T.dormRoomRow}>
                          <span style={{ color: "#334155", fontWeight: "600" }}>Room 102</span>
                          <span style={{ color: "#059669", fontWeight: "700" }}>2 Vacant Slots</span>
                        </div>
                      </div>

                      <div style={{ ...T.dormBox, background: "#fdf4ff", border: "1px solid #f5d0fe" }}>
                        <div style={T.dormHeader}>
                          <span style={{ color: "#7e22ce" }}>Block 2 (Female Residence)</span>
                          <span style={T.dormBadge}>4 / 4 Cap</span>
                        </div>
                        <div style={T.dormRoomRow}>
                          <span style={{ color: "#334155", fontWeight: "600" }}>Room 201</span>
                          <span style={{ color: "#7e22ce", fontWeight: "700" }}>Assigned: Ella Smith + 2</span>
                        </div>
                        <div style={T.dormRoomRow}>
                          <span style={{ color: "#334155", fontWeight: "600" }}>Room 202</span>
                          <span style={{ color: "#059669", fontWeight: "700" }}>1 Vacant Slot</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* University Department Catalog */}
      <section style={T.section} className="landing-section" id="curriculum">
        <div style={T.sectionHeader}>
          <div style={T.sectionEyebrow}>ACADEMIC DEPARTMENTS</div>
          <h2 style={T.sectionHeadline} className="landing-section-headline">Browse University Disciplines & Course Offerings</h2>
          <p style={T.sectionLead} className="landing-section-lead">
            Explore faculties and live curriculum governed by Campus Hub.
          </p>
        </div>

        {/* Department Selection Tabs */}
        <div style={T.deptTabRow} className="landing-dept-tab-row">
          {Object.keys(departments).map((k) => {
            const d = departments[k];
            const isActive = activeDept === k;
            return (
              <button
                key={k}
                style={{
                  ...T.deptTabBtn,
                  background: isActive ? d.bg : "#ffffff",
                  borderColor: isActive ? d.accent : "#cbd5e1",
                  color: isActive ? d.accent : "#475569",
                  fontWeight: isActive ? "700" : "600",
                }}
                onClick={() => setActiveDept(k)}
              >
                <span>{d.code}</span>
                <span style={{ opacity: 0.85 }}> — {d.name}</span>
              </button>
            );
          })}
        </div>

        {/* Department Details Card */}
        <div style={{ ...T.deptCard, background: departments[activeDept].bg, borderColor: departments[activeDept].border }} className="landing-dept-card">
          <div style={T.deptCardTop} className="landing-dept-card-top">
            <div>
              <h3 style={{ ...T.deptCardTitle, color: departments[activeDept].accent }}>
                {departments[activeDept].name} Department
              </h3>
              <div style={T.deptCardMeta}>
                Department Chair: <strong>{departments[activeDept].head}</strong> • {departments[activeDept].faculty} Resident Faculty
              </div>
            </div>
            <button
              style={{ ...T.btnExploreDept, background: departments[activeDept].accent }}
              onClick={() => onLaunchPortal("login")}
            >
              Sign In to Enroll →
            </button>
          </div>

          <div style={T.courseCardsRow} className="landing-course-cards-row">
            {departments[activeDept].courses.map((c) => (
              <div key={c.code} style={T.courseItemCard}>
                <div style={{ ...T.courseCodeBadge, color: departments[activeDept].accent, background: "#ffffff", border: `1px solid ${departments[activeDept].border}` }}>
                  {c.code}
                </div>
                <div style={T.courseTitleText}>{c.title}</div>
                <div style={T.courseFooterInfo}>
                  <span style={{ fontWeight: "600" }}>{c.units} Academic Units</span>
                  <span style={{ ...T.courseStatusPill, color: departments[activeDept].accent }}>● {c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live GPA & Standing Simulator Sandbox */}
      <section style={T.section} className="landing-section" id="evaluator">
        <div style={T.sectionHeader}>
          <div style={T.sectionEyebrow}>ACADEMIC AUDIT TOOL</div>
          <h2 style={T.sectionHeadline} className="landing-section-headline">Interactive GPA & Honors Standing Calculator</h2>
          <p style={T.sectionLead} className="landing-section-lead">
            Simulate how course marks dynamically influence academic standing and transcript outcomes.
          </p>
        </div>

        <div style={T.calcContainer} className="landing-calc-container">
          <div style={T.calcInputsPanel} className="landing-calc-inputs-panel">
            <div style={T.calcGroup}>
              <div style={T.calcGroupHeader}>
                <label style={T.calcLabel}>Student Assessment Score (0 – 100)</label>
                <span style={T.calcScoreDisplay}>{calcScore} / 100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={calcScore}
                onChange={(e) => setCalcScore(Number(e.target.value))}
                style={T.calcSlider}
              />
            </div>

            <div style={T.calcGroup}>
              <label style={T.calcLabel}>Credit Hours Assigned</label>
              <div style={T.unitSelector}>
                {[1, 2, 3, 4, 5].map((u) => (
                  <button
                    key={u}
                    type="button"
                    style={{ ...T.unitBtn, ...(calcUnits === u ? T.unitBtnActive : {}) }}
                    onClick={() => setCalcUnits(u)}
                  >
                    {u} Credit Unit{u > 1 ? "s" : ""}
                  </button>
                ))}
              </div>
            </div>

            <div style={T.calcPolicyCard}>
              <div style={T.policyTitle}>🏛️ Institutional GPA Policies:</div>
              <div style={T.policyItem}>• <strong>GPA ≥ 2.00:</strong> Good Standing (Eligible for graduation & registration)</div>
              <div style={T.policyItem}>• <strong>GPA 1.75 – 1.99:</strong> Academic Probation (Mandatory advisement)</div>
              <div style={T.policyItem}>• <strong>GPA &lt; 1.75:</strong> Academic Dismissal (Course enrollment locked)</div>
            </div>
          </div>

          <div style={T.calcResultsPanel} className="landing-calc-results-panel">
            <div style={T.resultGradeTitle}>Projected Unit Grade</div>
            <div style={{ ...T.resultGradeValue, color: standing.tone }} className="landing-calc-grade-val">{standing.grade}</div>

            <div style={T.resBreakdown}>
              <div style={T.resStatBox}>
                <div style={T.resStatLbl}>Grade Points</div>
                <div style={{ ...T.resStatVal, color: standing.tone }}>{standing.gpa}</div>
              </div>
              <div style={T.resStatBox}>
                <div style={T.resStatLbl}>Quality Points</div>
                <div style={{ ...T.resStatVal, color: standing.tone }}>{(Number(standing.gpa) * calcUnits).toFixed(2)}</div>
              </div>
            </div>

            <div style={T.standingResultBox}>
              <div style={T.standingResultLabel}>Formal Institutional Standing:</div>
              <div style={{ ...T.standingResultBadge, borderColor: standing.tone, color: standing.tone, background: "#ffffff" }}>
                ● {standing.status} — {standing.honor}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* University Operations Lifecycle */}
      <section style={T.section} className="landing-section" id="operations">
        <div style={T.sectionHeader}>
          <div style={T.sectionEyebrow}>GOVERNANCE LIFECYCLE</div>
          <h2 style={T.sectionHeadline} className="landing-section-headline">How Campus Hub Enforces University Workflows</h2>
          <p style={T.sectionLead} className="landing-section-lead">
            A sequential five-stage pipeline designed for institutional compliance.
          </p>
        </div>

        <div style={T.pipelineGrid} className="landing-pipeline-grid">
          {[
            { n: "01", t: "Term & Catalog Calibration", d: "Admins establish academic terms, credit curricula, and student cohort sections.", bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" },
            { n: "02", t: "Faculty Course Assignment", d: "Department deans assign course heads and synchronize active lecture rosters.", bg: "#ecfdf5", border: "#a7f3d0", text: "#047857" },
            { n: "03", t: "Course Registration Approval", d: "Students submit semester enrollments; registrar reviews and issues student status.", bg: "#fdf4ff", border: "#f5d0fe", text: "#7e22ce" },
            { n: "04", t: "Grade Entry & Revisions", d: "Professors enter raw assessment marks. Grade changes require formal dean audit.", bg: "#fffbeb", border: "#fde68a", text: "#b45309" },
            { n: "05", t: "Automatic GPA Calculation", d: "Real-time engine computes GPA, updates academic standing, and alerts probation.", bg: "#f0fdfa", border: "#99f6e4", text: "#0f766e" },
          ].map((item) => (
            <div key={item.n} style={{ ...T.pipelineCard, background: item.bg, border: `1px solid ${item.border}` }}>
              <div style={{ ...T.pipeNumber, color: item.text, background: "#ffffff" }}>{item.n}</div>
              <h4 style={{ ...T.pipeTitle, color: item.text }}>{item.t}</h4>
              <p style={{ ...T.pipeDesc, color: "#475569" }}>{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Campus Footer */}
      <footer style={T.footer} className="landing-footer">
        <div style={T.footerInner} className="landing-footer-inner">
          <div style={T.footerBrandRow}>
            <div style={T.crestIconSmall}>🏛️</div>
            <div>
              <div style={T.footerTitle}>CAMPUS HUB ACADEMIC SYSTEMS</div>
              <div style={T.footerTag}>University Student Information & Registrar Platform</div>
            </div>
          </div>

          <div style={T.footerLinks} className="landing-footer-links">
            <button style={T.fBtn} onClick={() => scrollTo("top")}>Back to Top</button>
            <button style={T.fBtn} onClick={() => scrollTo("curriculum")}>Curriculum</button>
            <button style={T.fBtn} onClick={() => scrollTo("evaluator")}>GPA Simulator</button>
            <button style={T.fBtn} onClick={() => onLaunchPortal("login")}>Sign In to Portal</button>
          </div>

          <div style={T.footerCopy}>
            Engineered by <strong>Biniyam Girma</strong> • Educational ERP Architecture
          </div>
        </div>
      </footer>
    </div>
  );
}

// Official Academic Registry Theme & Design Tokens — Rich Multi-Color Light Theme
const T = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#0f172a",
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    lineHeight: 1.5,
    overflowX: "hidden",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(255, 255, 255, 0.94)",
    backdropFilter: "blur(18px)",
    borderBottom: "1px solid #e2e8f0",
  },
  headerInner: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0.9rem 1.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1.5rem",
  },
  brandGroup: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  },
  crestIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
    border: "1px solid rgba(37, 99, 235, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)",
  },
  crestSymbol: {
    fontSize: "20px",
  },
  brandTitle: {
    fontWeight: "800",
    fontSize: "16px",
    letterSpacing: "0.08em",
    color: "#0f172a",
  },
  brandSubtitle: {
    fontSize: "10px",
    letterSpacing: "0.05em",
    color: "#2563eb",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  navMenu: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  navLink: {
    background: "none",
    border: "none",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    padding: "6px 8px",
    transition: "color 0.15s ease",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  btnNavSecondary: {
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    color: "#334155",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  btnNavPrimary: {
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    border: "1px solid #1d4ed8",
    color: "#fff",
    padding: "8px 18px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
  },
  heroSection: {
    padding: "4.5rem 1.75rem 3.5rem",
    maxWidth: "1280px",
    margin: "0 auto",
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "3rem",
    alignItems: "flex-start",
  },
  heroLeft: {
    textAlign: "left",
  },
  statusTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#1d4ed8",
    letterSpacing: "0.06em",
    marginBottom: "1.25rem",
  },
  pulseDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#2563eb",
    boxShadow: "0 0 8px #60a5fa",
  },
  heroHeading: {
    fontSize: "clamp(1.75rem, 4vw, 3.25rem)",
    fontWeight: "800",
    lineHeight: 1.15,
    letterSpacing: "-0.03em",
    color: "#0f172a",
    margin: "0 0 1.25rem",
  },
  heroHeadingAccent: {
    background: "linear-gradient(135deg, #1d4ed8, #0284c7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroText: {
    fontSize: "15px",
    color: "#475569",
    lineHeight: 1.65,
    marginBottom: "2rem",
  },
  heroButtonGroup: {
    display: "flex",
    gap: "12px",
    marginBottom: "2.5rem",
    flexWrap: "wrap",
  },
  heroPrimaryBtn: {
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    border: "1px solid #1d4ed8",
    color: "#fff",
    padding: "13px 26px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 18px rgba(37, 99, 235, 0.35)",
  },
  heroSecondaryBtn: {
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    color: "#334155",
    padding: "13px 24px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  accessCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "1.25rem",
    boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)",
  },
  accessCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "1px solid #f1f5f9",
  },
  accessCardTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  accessCardNote: {
    fontSize: "11px",
    color: "#64748b",
  },
  roleGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  rolePill: {
    borderRadius: "10px",
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },
  rolePillIcon: {
    fontSize: "20px",
  },
  rolePillName: {
    fontSize: "12px",
    fontWeight: "700",
  },
  rolePillMeta: {
    fontSize: "10px",
    color: "#64748b",
  },
  heroRight: {},
  terminalWindow: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
  },
  terminalTitlebar: {
    background: "#f8fafc",
    padding: "10px 16px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  windowDots: {
    display: "flex",
    gap: "6px",
  },
  wDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  windowTitle: {
    fontSize: "11px",
    color: "#64748b",
    fontFamily: "monospace",
  },
  windowStatusBadge: {
    fontSize: "9px",
    fontWeight: "800",
    padding: "2px 8px",
    borderRadius: "4px",
    background: "#ecfdf5",
    color: "#059669",
    border: "1px solid #a7f3d0",
    letterSpacing: "0.06em",
  },
  terminalTabs: {
    display: "flex",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    padding: "0 10px",
  },
  termTab: {
    background: "none",
    border: "none",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "600",
    padding: "10px 14px",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
  },
  termTabActive: {
    color: "#2563eb",
    borderBottomColor: "#2563eb",
    fontWeight: "700",
  },
  terminalBody: {
    padding: "1.5rem",
    background: "#ffffff",
  },
  transcriptUserBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.25rem",
    paddingBottom: "12px",
    borderBottom: "1px solid #f1f5f9",
  },
  tUserName: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#0f172a",
  },
  tUserDept: {
    fontSize: "11px",
    color: "#64748b",
    marginTop: "2px",
  },
  tHonorBadge: {
    fontSize: "10px",
    fontWeight: "700",
    padding: "3px 8px",
    borderRadius: "6px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    color: "#1d4ed8",
  },
  tMetricsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    marginBottom: "1.25rem",
  },
  tMetricBox: {
    borderRadius: "10px",
    padding: "10px",
    textAlign: "center",
  },
  tMetricNum: {
    fontSize: "20px",
    fontWeight: "800",
  },
  tMetricLabel: {
    fontSize: "10px",
    color: "#64748b",
    marginTop: "2px",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  tCourseTable: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    overflowX: "auto",
    overflowY: "hidden",
    WebkitOverflowScrolling: "touch",
  },
  tTableHead: {
    display: "grid",
    gridTemplateColumns: "1fr 60px 60px 80px",
    padding: "8px 12px",
    background: "#f8fafc",
    fontSize: "10px",
    color: "#64748b",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  tTableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 60px 60px 80px",
    padding: "10px 12px",
    borderTop: "1px solid #f1f5f9",
    fontSize: "11px",
    color: "#334155",
    alignItems: "center",
  },
  workflowList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  workflowStep: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 14px",
    borderRadius: "10px",
  },
  wfNumber: {
    fontSize: "12px",
    fontWeight: "800",
    padding: "4px 8px",
    borderRadius: "6px",
  },
  wfContent: {
    flex: 1,
  },
  wfTitle: {
    fontSize: "12px",
    fontWeight: "700",
  },
  wfDesc: {
    fontSize: "10px",
    color: "#64748b",
  },
  wfCheck: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "#d1fae5",
    color: "#047857",
    fontSize: "11px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dormGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  dormBox: {
    borderRadius: "10px",
    padding: "12px",
  },
  dormHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "11px",
    fontWeight: "700",
    marginBottom: "10px",
    paddingBottom: "6px",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
  },
  dormBadge: {
    fontSize: "9px",
    color: "#64748b",
  },
  dormRoomRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    padding: "4px 0",
  },
  section: {
    maxWidth: "1280px",
    margin: "0 auto 5rem",
    padding: "0 1.75rem",
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: "2.5rem",
  },
  sectionEyebrow: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "0.12em",
    color: "#2563eb",
    marginBottom: "8px",
    textTransform: "uppercase",
  },
  sectionHeadline: {
    fontSize: "clamp(1.6rem, 3vw, 2.35rem)",
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: "-0.02em",
    margin: "0 0 10px",
  },
  sectionLead: {
    fontSize: "15px",
    color: "#64748b",
    maxWidth: "600px",
    margin: "0 auto",
  },
  deptTabRow: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "1.75rem",
  },
  deptTabBtn: {
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    transition: "all 0.15s ease",
  },
  deptCard: {
    borderRadius: "18px",
    padding: "2rem",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
    transition: "all 0.2s ease",
  },
  deptCardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "1.5rem",
    marginBottom: "1.5rem",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    flexWrap: "wrap",
    gap: "1rem",
  },
  deptCardTitle: {
    fontSize: "20px",
    fontWeight: "800",
    margin: "0 0 4px",
  },
  deptCardMeta: {
    fontSize: "12px",
    color: "#64748b",
  },
  btnExploreDept: {
    border: "none",
    color: "#fff",
    padding: "9px 18px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  courseCardsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "14px",
  },
  courseItemCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "1.25rem",
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
  },
  courseCodeBadge: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "800",
    padding: "2px 8px",
    borderRadius: "6px",
    marginBottom: "8px",
  },
  courseTitleText: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "12px",
    lineHeight: 1.4,
  },
  courseFooterInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "11px",
    color: "#64748b",
    borderTop: "1px solid #f1f5f9",
    paddingTop: "8px",
  },
  courseStatusPill: {
    fontWeight: "700",
  },
  calcContainer: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "2.25rem",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2.5rem",
    alignItems: "center",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
  },
  calcInputsPanel: {
    textAlign: "left",
  },
  calcGroup: {
    marginBottom: "1.75rem",
  },
  calcGroupHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  calcLabel: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#0f172a",
  },
  calcScoreDisplay: {
    fontSize: "14px",
    fontWeight: "800",
    color: "#2563eb",
  },
  calcSlider: {
    width: "100%",
    accentColor: "#2563eb",
    cursor: "pointer",
  },
  unitSelector: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "8px",
  },
  unitBtn: {
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "7px 14px",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
  unitBtnActive: {
    background: "#2563eb",
    borderColor: "#1d4ed8",
    color: "#fff",
  },
  calcPolicyCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "12px 14px",
    fontSize: "11px",
    color: "#475569",
    lineHeight: 1.6,
  },
  policyTitle: {
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "4px",
  },
  policyItem: {
    marginTop: "2px",
  },
  calcResultsPanel: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "2rem",
    textAlign: "center",
  },
  resultGradeTitle: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#64748b",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "6px",
  },
  resultGradeValue: {
    fontSize: "72px",
    fontWeight: "900",
    lineHeight: 1,
    letterSpacing: "-2px",
    marginBottom: "1.25rem",
  },
  resBreakdown: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "1.5rem",
  },
  resStatBox: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "10px",
  },
  resStatLbl: {
    fontSize: "10px",
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  resStatVal: {
    fontSize: "16px",
    fontWeight: "800",
    marginTop: "2px",
  },
  standingResultBox: {
    paddingTop: "1rem",
    borderTop: "1px solid #e2e8f0",
  },
  standingResultLabel: {
    fontSize: "11px",
    color: "#64748b",
    marginBottom: "6px",
    fontWeight: "600",
  },
  standingResultBadge: {
    display: "inline-block",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    border: "1.5px solid",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  },
  pipelineGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },
  pipelineCard: {
    borderRadius: "14px",
    padding: "1.5rem",
    textAlign: "left",
    boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
  },
  pipeNumber: {
    fontSize: "12px",
    fontWeight: "800",
    padding: "2px 8px",
    borderRadius: "6px",
    display: "inline-block",
    marginBottom: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  pipeTitle: {
    fontSize: "14px",
    fontWeight: "800",
    margin: "0 0 6px",
  },
  pipeDesc: {
    fontSize: "12px",
    lineHeight: 1.5,
    margin: 0,
  },
  footer: {
    background: "#f1f5f9",
    borderTop: "1px solid #e2e8f0",
    padding: "2.5rem 1.75rem",
  },
  footerInner: {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1.5rem",
    flexWrap: "wrap",
  },
  footerBrandRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  crestIconSmall: {
    fontSize: "20px",
  },
  footerTitle: {
    fontSize: "14px",
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: "0.06em",
  },
  footerTag: {
    fontSize: "11px",
    color: "#64748b",
  },
  footerLinks: {
    display: "flex",
    gap: "1.25rem",
    flexWrap: "wrap",
  },
  fBtn: {
    background: "none",
    border: "none",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  footerCopy: {
    fontSize: "12px",
    color: "#64748b",
  },
};
