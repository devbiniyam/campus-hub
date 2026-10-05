from decimal import Decimal
from django.core.management import call_command
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from academic.models import (
    Department, Course, Semester, CourseAssignment, Enrollment,
    GradeSubmission, AcademicStatus
)
from registration.models import Registration, RegistrationStatus

User = get_user_model()


class CampusHubBackendTests(APITestCase):
    def setUp(self):
        call_command("seed_demo_data")
        self.admin = User.objects.get(username="admin")
        self.teacher = User.objects.get(username="teacher.yada")
        self.student = User.objects.get(username="student.dave")
        self.student_ela = User.objects.get(username="student.ela")

    def test_seed_demo_data_created_entities(self):
        """Verify that demo seed command creates required academic records."""
        self.assertTrue(Department.objects.filter(code="CS").exists())
        self.assertTrue(Semester.objects.filter(is_active=True).exists())
        self.assertTrue(Course.objects.filter(code="CS101").exists())
        self.assertEqual(self.admin.role, "ADMIN")
        self.assertEqual(self.teacher.role, "TEACHER")
        self.assertEqual(self.student.role, "STUDENT")

    def test_jwt_auth_login_admin(self):
        """Verify JWT login returns access and refresh tokens for admin."""
        res = self.client.post("/api/auth/login/", {
            "username": "admin",
            "password": "admin123"
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access", res.data)
        self.assertIn("refresh", res.data)

    def test_jwt_auth_login_student(self):
        """Verify JWT login returns access and refresh tokens for student."""
        res = self.client.post("/api/auth/login/", {
            "username": "student.dave",
            "password": "student123"
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access", res.data)

    def test_users_me_endpoint(self):
        """Verify /api/users/me/ returns current authenticated profile."""
        self.client.force_authenticate(user=self.student)
        res = self.client.get("/api/users/me/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["username"], "student.dave")
        self.assertEqual(res.data["role"], "STUDENT")
        self.assertEqual(res.data["student_id"], "STU-CS-2024-001")

    def test_admin_approve_registration(self):
        """Verify Admin can approve a student's pending course registration."""
        pending_reg = Registration.objects.filter(student=self.student_ela, status=RegistrationStatus.PENDING).first()
        self.assertIsNotNone(pending_reg)

        self.client.force_authenticate(user=self.admin)
        res = self.client.post(f"/api/registrations/{pending_reg.id}/approve/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        pending_reg.refresh_from_db()
        self.assertEqual(pending_reg.status, RegistrationStatus.APPROVED)
        enrollments = Enrollment.objects.filter(student=self.student_ela, semester=pending_reg.semester)
        self.assertGreater(enrollments.count(), 0)

    def test_teacher_grade_submission_updates_gpa(self):
        """Verify teacher submitting mark calculates letter grade and updates GPA."""
        fall_sem = Semester.objects.get(is_active=True)
        cs201 = Course.objects.get(code="CS201")
        enr_cs201 = Enrollment.objects.get(student=self.student, course=cs201, semester=fall_sem)

        self.client.force_authenticate(user=self.teacher)
        res = self.client.post("/api/grade-submissions/", {
            "enrollment": enr_cs201.id,
            "mark": 88.5
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        enr_cs201.refresh_from_db()
        self.assertEqual(enr_cs201.grade, "A")

        status_rec = AcademicStatus.objects.filter(student=self.student, semester=fall_sem).first()
        self.assertIsNotNone(status_rec)
        self.assertIsNotNone(status_rec.semester_gpa)
        self.assertGreater(status_rec.semester_gpa, Decimal("3.0"))
