# Campus Hub

A full-stack university campus management system built with **Django REST Framework** and **React**. Designed to handle the complete academic lifecycle — from student registration and course enrollment to grade submission and dormitory management — with role-based access for students, teachers, and admins.

Now featuring a **modern landing page**, **1-click interactive demo testing (like FeeBridge)**, an **in-app demo role switcher**, and **production cloud deployment blueprints** for Render and Vercel.

---

## Table of Contents

- [Overview](#overview)
- [Interactive Demo Testing](#interactive-demo-testing)
- [Landing Page & Live GPA Tool](#landing-page--live-gpa-tool)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Running Automated Tests](#running-automated-tests)
- [Cloud Deployment Guide](#cloud-deployment-guide)
  - [Render Deployment (Backend + PostgreSQL)](#render-deployment-backend--postgresql)
  - [Vercel Deployment (Frontend)](#vercel-deployment-frontend)
- [API Reference](#api-reference)
- [Role-Based Access](#role-based-access)
- [Academic Flow](#academic-flow)
- [Environment Variables](#environment-variables)

---

## Overview

Campus Hub is a management platform that mirrors real university workflows. An admin sets up semesters, departments, and courses. Students register for courses each semester. Admins approve registrations, which atomically creates enrollments. Teachers submit marks which automatically derive letter grades. Academic standing is calculated automatically based on GPA rules.

Every piece of the system enforces business rules at the database level — not just in the frontend — making the platform robust and consistent regardless of how data enters the system.

---

## Interactive Demo Testing

Just like modern fintech and SaaS applications, Campus Hub includes **1-click interactive demo testing**:

1. **Landing Page Quick Demo Pills**:
   - 🎓 **Student Demo**: `student.dave` / `student123` (Dave Daniel • Computer Science • 3.80 GPA)
   - 👨‍🏫 **Faculty Demo**: `teacher.yada` / `teacher123` (Dr. Yared Assefa • Computer Science Faculty)
   - 🛡️ **Admin / Dean Demo**: `admin` / `admin123` (Registrar & Dean Administrator)
   - 👩‍🎓 **Registration Tester**: `student.ela` / `student123` (Ella Smith • Software Engineering • Pending Registration)

2. **In-App Interactive Sandbox Switcher**:
   When exploring the portal, a top bar allows instant switching between Student, Faculty, and Admin roles with 1 click without logging out and re-typing credentials. This lets evaluators test the complete academic lifecycle in seconds:
   - **Student submits course request** ➔ **Admin approves** ➔ **Faculty submits grade** ➔ **Student views updated GPA & transcript**.

3. **Automated Idempotent Seeding**:
   ```bash
   python manage.py seed_demo_data
   ```
   Synchronizes 4 departments, 2 semesters, 8 courses, class sections, dormitory allocations, teacher assignments, and demo accounts with one command.

---

## Landing Page & Live GPA Tool

When visitors arrive at the platform, they are greeted by a modern, responsive landing page featuring:
- **Interactive Academic Flow Stepper**: Visual 5-step walkthrough of university operations.
- **Role Experience Portals**: Tabbed breakdown of Student, Teacher, and Administrator capabilities with direct test launches.
- **Live GPA & Standing Calculator**: An interactive sandbox slider that converts numerical marks (0–100) into letter grades, grade points (4.0 scale), quality weights, and calculated academic standing (Active, Probation, or Dismissed).

---

## Features

### Student
- Register for courses each semester (one registration per semester enforced)
- View registration status (Pending / Approved / Rejected)
- Re-register after rejection
- Browse course catalog filtered by department
- View grades per semester with GPA tracking
- View cumulative GPA and academic standing (Active / Probation / Dismissed)
- View assigned dormitory building and room number
- Edit personal profile

### Teacher
- View assigned courses for the active semester
- See enrolled student roster per course
- Submit marks (0–100) — letter grade auto-calculated
- Request grade changes for already-submitted grades
- View academic standing of students in their courses

### Admin
- Full user management — create, edit, delete students and teachers
- Semester management — create, activate, and manage semesters
- Section management — create sections and assign students
- Course assignment — assign teachers to courses per semester
- Dormitory management — create rooms and assign students (gender-restricted, capacity-limited)
- Approve or reject student registration requests
- Approve or reject teacher grade change requests
- System overview dashboard

---

## Tech Stack

**Backend**
- Python 3.10+ / Django 6.x
- Django REST Framework
- Simple JWT (token-based authentication)
- django-cors-headers
- PostgreSQL (production) / SQLite (development)
- python-decouple (environment configuration)
- dj-database-url (dynamic database connection strings)
- Whitenoise (compressed static file serving)
- Gunicorn (production WSGI server)

**Frontend**
- React 18
- React functional components with hooks
- Fetch API with dynamic `API_BASE` resolution
- Responsive CSS-in-JS + custom dark theme design system
- DM Sans font (Google Fonts)

---

## Project Structure

```
campus-hub/
├── render.yaml                         # 1-Click Render Blueprint (Backend + Postgres)
├── Backend/
│   └── backend/
│       ├── .env.example                # Backend environment configuration template
│       ├── build.sh                    # Production build script (migrate, collectstatic, seed)
│       ├── Procfile                    # Gunicorn entrypoint for cloud hosting
│       ├── requirements.txt            # Python dependencies (UTF-8)
│       ├── manage.py                   # Django management script
│       ├── academic/                   # Courses, enrollments, grades, sections, GPA
│       │   └── management/commands/    # seed_demo_data command
│       ├── api/                        # ViewSets, serializers, permissions, URLs, tests.py
│       ├── backend/                    # Django settings (decouple, dj_database_url), root URLs
│       ├── dormitory/                  # Dormitory rooms and student assignments
│       ├── registration/               # Course registration requests and approval flow
│       └── user/                       # Custom user model, JWT serializer
│
└── Frontend/
    ├── .env.example                    # Frontend environment configuration template
    ├── vercel.json                     # Vercel SPA routing rewrite rules
    ├── package.json                    # Frontend dependencies and build scripts
    └── src/
        ├── api.js                      # Base fetch helper + dynamic API_BASE + demoLogin
        ├── App.jsx                     # Root component, router, sidebar & in-app demo switcher
        ├── LandingPage.jsx             # Modern marketing landing page & live GPA sandbox
        ├── Login.jsx                   # Sign-in portal with 1-click demo accounts
        ├── StudentDashboard.jsx        # Student home screen
        ├── TeacherDashboard.jsx        # Teacher home screen
        ├── AdminDashboard.jsx          # Admin home screen
        ├── RegistrationPage.jsx        # Student course registration
        ├── GradeSubmissionPage.jsx     # Teacher grade submission
        ├── GradesHistoryPage.jsx       # Student grade history
        ├── StudentStatusPage.jsx       # Teacher view of student standing
        ├── CoursesPage.jsx             # Course and department browser
        ├── ProfilePage.jsx             # User profile view and edit
        ├── SemesterManagementPage.jsx  # Admin semester CRUD
        ├── UserManagementPage.jsx      # Admin user CRUD
        ├── SectionManagementPage.jsx   # Admin section and assignment management
        ├── CourseAssignmentPage.jsx    # Admin teacher-to-course assignment
        └── DormitoryManagementPage.jsx # Admin dormitory management
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- Git

---

### Backend Setup

**1. Clone the repository**

```bash
git clone https://github.com/biniyamgirma-dev/campus-hub.git
cd campus-hub
```

**2. Create and activate a virtual environment**

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS / Linux
python -m venv .venv
source .venv/bin/activate
```

**3. Install dependencies**

```bash
cd Backend/backend
pip install -r requirements.txt
```

**4. Run migrations & seed demo data**

```bash
python manage.py migrate
python manage.py seed_demo_data
```

**5. Start the Django server**

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

---

### Frontend Setup

**1. Open a new terminal and navigate to Frontend**

```bash
cd Frontend
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the React app**

```bash
npm start
```

The app will open at `http://localhost:3000` with the landing page and 1-click demo buttons.

---

### Running Automated Tests

Run the full backend test suite to verify JWT authentication, course registrations, grade calculations, and demo seeding:

```bash
cd Backend/backend
python manage.py test api
```

---

## Cloud Deployment Guide

### Render Deployment (Backend + PostgreSQL)

A complete `render.yaml` Blueprint is included in the project root:

1. Push your repository to GitHub.
2. In the Render Dashboard, click **New +** ➔ **Blueprint**.
3. Select your repository. Render will automatically provision:
   - **PostgreSQL Database** (`campus-hub-db`)
   - **Python Web Service** (`campus-hub-backend`)
4. The service runs `build.sh` automatically:
   - Installs dependencies from `requirements.txt`
   - Compiles static assets via Whitenoise
   - Executes database migrations
   - Seeds initial demo accounts and academic catalog

### Vercel Deployment (Frontend)

1. Connect your repository in Vercel.
2. Set **Root Directory** to `Frontend`.
3. Add the environment variable:
   ```
   REACT_APP_API_BASE=https://your-campus-hub-backend.onrender.com/api
   ```
4. Click **Deploy**. Vercel uses `vercel.json` to handle all client-side routing.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login/` | Login — returns JWT access + refresh tokens |
| GET | `/api/users/me/` | Get current user profile |
| GET/POST | `/api/users/` | List or create users (admin only) |
| GET/POST | `/api/semesters/` | List or create semesters |
| GET/POST | `/api/departments/` | List or create departments |
| GET/POST | `/api/courses/` | List or create courses |
| GET/POST | `/api/course-assignments/` | Assign teachers to courses |
| GET/POST | `/api/registrations/` | Student registration requests |
| POST | `/api/registrations/{id}/approve/` | Admin approves registration |
| POST | `/api/registrations/{id}/reject/` | Admin rejects registration |
| GET/POST | `/api/enrollments/` | Course enrollments |
| GET/POST | `/api/grade-submissions/` | Teacher grade submission |
| GET/POST | `/api/grade-change-requests/` | Grade change requests |
| POST | `/api/grade-change-requests/{id}/approve/` | Admin approves grade change |
| GET/POST | `/api/sections/` | Sections management |
| GET/POST | `/api/section-assignments/` | Assign students to sections |
| GET/POST | `/api/academic-status/` | Student GPA and academic standing |
| GET/POST | `/api/dormitories/` | Dormitory rooms |
| GET/POST | `/api/dormitory-assignments/` | Assign students to dorms |

---

## Role-Based Access

| Feature | Student | Teacher | Admin |
|---------|---------|---------|-------|
| View own dashboard | ✅ | ✅ | ✅ |
| Register for courses | ✅ | ❌ | ❌ |
| View own grades | ✅ | ❌ | ❌ |
| Submit grades | ❌ | ✅ | ❌ |
| Request grade change | ❌ | ✅ | ❌ |
| View student standing | ❌ | ✅ | ❌ |
| Approve registrations | ❌ | ❌ | ✅ |
| Approve grade changes | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| Manage semesters | ❌ | ❌ | ✅ |
| Manage sections | ❌ | ❌ | ✅ |
| Manage dormitories | ❌ | ❌ | ✅ |
| Assign teachers to courses | ❌ | ❌ | ✅ |
| Browse courses | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ |

---

## Academic Flow

```
1. Admin creates semester and activates it
        ↓
2. Admin creates departments, courses, and sections
        ↓
3. Admin creates student and teacher accounts
        ↓
4. Admin assigns teachers to courses
        ↓
5. Student submits a registration request (selects courses)
        ↓
6. Admin approves the registration
        ↓
7. Enrollments are created automatically
        ↓
8. Teacher submits marks → letter grades calculated automatically
        ↓
9. GPA and academic standing updated automatically
```

**Grade scale:**

| Mark | Grade | Points |
|------|-------|--------|
| 90–100 | A+ | 4.0 |
| 85–89 | A | 4.0 |
| 80–84 | A- | 3.75 |
| 75–79 | B+ | 3.5 |
| 70–74 | B | 3.0 |
| 65–69 | B- | 2.75 |
| 60–64 | C+ | 2.5 |
| 50–59 | C | 2.0 |
| 45–49 | C- | 1.75 |
| 40–44 | D | 1.0 |
| 0–39 | F | 0.0 |

**Academic standing rules:**
- GPA ≥ 2.00 → **Active**
- GPA 1.75–1.99 → **Probation**
- GPA < 1.75 → **Dismissed** (blocked from registering)

---

## Author

Built by **Biniyam Girma**
