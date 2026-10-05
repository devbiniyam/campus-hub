from datetime import date
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from academic.models import (
    Department, Course, Semester, CourseAssignment, Enrollment,
    GradeSubmission, GradeChangeRequest, Section, SectionAssignment, AcademicStatus
)
from dormitory.models import Dormitory, DormitoryAssignment, DormitoryGender
from registration.models import Registration, RegistrationStatus
from user.models import RoleChoices, GenderChoice

User = get_user_model()


class Command(BaseCommand):
    help = "Seeds realistic demo data for Campus Hub (Admin, Teacher, Students, Courses, Dorms, etc.)"

    def handle(self, *args, **options):
        self.stdout.write("Seeding Campus Hub demo data...")

        # ------------------------------------------------------------
        # 1. Departments
        # ------------------------------------------------------------
        cs_dept, _ = Department.objects.get_or_create(
            code="CS",
            defaults={"name": "Computer Science", "description": "School of Computing & Data Sciences"}
        )
        se_dept, _ = Department.objects.get_or_create(
            code="SE",
            defaults={"name": "Software Engineering", "description": "Software Systems & Architecture"}
        )
        it_dept, _ = Department.objects.get_or_create(
            code="IT",
            defaults={"name": "Information Technology", "description": "Networking, Cloud & Systems Administration"}
        )
        ee_dept, _ = Department.objects.get_or_create(
            code="EE",
            defaults={"name": "Electrical Engineering", "description": "Circuits, Hardware & Embedded Systems"}
        )
        self.stdout.write(self.style.SUCCESS("[OK] Departments synced"))

        # ------------------------------------------------------------
        # 2. Semesters
        # ------------------------------------------------------------
        fall_sem, _ = Semester.objects.get_or_create(
            year="2026/27",
            name="Fall Semester",
            defaults={
                "start_date": date(2026, 9, 1),
                "end_date": date(2027, 1, 31),
                "is_active": True,
            }
        )
        fall_sem.is_active = True
        fall_sem.save()

        spring_sem, _ = Semester.objects.get_or_create(
            year="2025/26",
            name="Spring Semester",
            defaults={
                "start_date": date(2026, 2, 1),
                "end_date": date(2026, 6, 30),
                "is_active": False,
            }
        )
        spring_sem.is_active = False
        spring_sem.save()
        self.stdout.write(self.style.SUCCESS("[OK] Semesters synced"))

        # ------------------------------------------------------------
        # 3. Courses
        # ------------------------------------------------------------
        cs101, _ = Course.objects.get_or_create(
            code="CS101",
            defaults={"name": "Data Structures & Algorithms", "department": cs_dept, "credit_hours": 3, "is_active": True}
        )
        cs201, _ = Course.objects.get_or_create(
            code="CS201",
            defaults={"name": "Database Management Systems", "department": cs_dept, "credit_hours": 3, "is_active": True}
        )
        cs301, _ = Course.objects.get_or_create(
            code="CS301",
            defaults={"name": "Computer Networks & Security", "department": cs_dept, "credit_hours": 3, "is_active": True}
        )
        cs401, _ = Course.objects.get_or_create(
            code="CS401",
            defaults={"name": "Operating Systems Internals", "department": cs_dept, "credit_hours": 4, "is_active": True}
        )
        se101, _ = Course.objects.get_or_create(
            code="SE101",
            defaults={"name": "Software Architecture & Design", "department": se_dept, "credit_hours": 3, "is_active": True}
        )
        se201, _ = Course.objects.get_or_create(
            code="SE201",
            defaults={"name": "Full-Stack Web Engineering", "department": se_dept, "credit_hours": 3, "is_active": True}
        )
        it101, _ = Course.objects.get_or_create(
            code="IT101",
            defaults={"name": "Cloud Infrastructure & DevOps", "department": it_dept, "credit_hours": 3, "is_active": True}
        )
        ee101, _ = Course.objects.get_or_create(
            code="EE101",
            defaults={"name": "Digital Logic & Microprocessors", "department": ee_dept, "credit_hours": 4, "is_active": True}
        )
        self.stdout.write(self.style.SUCCESS("[OK] Courses synced"))

        # ------------------------------------------------------------
        # 4. Dormitories
        # ------------------------------------------------------------
        dorm_m1, _ = Dormitory.objects.get_or_create(
            block=1, room=101, gender=DormitoryGender.MALE,
            defaults={"capacity": 4, "is_active": True, "department": cs_dept}
        )
        dorm_m2, _ = Dormitory.objects.get_or_create(
            block=1, room=102, gender=DormitoryGender.MALE,
            defaults={"capacity": 4, "is_active": True}
        )
        dorm_f1, _ = Dormitory.objects.get_or_create(
            block=2, room=201, gender=DormitoryGender.FEMALE,
            defaults={"capacity": 4, "is_active": True, "department": se_dept}
        )
        dorm_f2, _ = Dormitory.objects.get_or_create(
            block=2, room=202, gender=DormitoryGender.FEMALE,
            defaults={"capacity": 4, "is_active": True}
        )
        self.stdout.write(self.style.SUCCESS("[OK] Dormitories synced"))

        # ------------------------------------------------------------
        # 5. Sections
        # ------------------------------------------------------------
        sec_cs_a, _ = Section.objects.get_or_create(
            department=cs_dept, name="A", entry_year=2024, program_year=2,
            defaults={"capacity": 40, "is_active": True}
        )
        sec_cs_b, _ = Section.objects.get_or_create(
            department=cs_dept, name="B", entry_year=2024, program_year=2,
            defaults={"capacity": 40, "is_active": True}
        )
        sec_se_a, _ = Section.objects.get_or_create(
            department=se_dept, name="A", entry_year=2024, program_year=2,
            defaults={"capacity": 40, "is_active": True}
        )
        self.stdout.write(self.style.SUCCESS("[OK] Sections synced"))

        # ------------------------------------------------------------
        # 6. User Accounts (Admin, Teacher, Students)
        # ------------------------------------------------------------
        # Admin account: admin / admin123
        admin_user = User.objects.filter(username="admin").first()
        if not admin_user:
            admin_user = User(username="admin")
        admin_user.first_name = "Dean"
        admin_user.last_name = "Administrator"
        admin_user.email = "admin@campushub.edu"
        admin_user.role = RoleChoices.ADMIN
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.set_password("admin123")
        admin_user.save()

        # Legacy bini account
        bini_user = User.objects.filter(username="bini").first()
        if bini_user:
            bini_user.first_name = bini_user.first_name or "Biniyam"
            bini_user.last_name = bini_user.last_name or "Girma"
            bini_user.role = RoleChoices.ADMIN
            bini_user.is_staff = True
            bini_user.is_superuser = True
            bini_user.set_password("admin123")
            bini_user.save()

        # Teacher account: teacher.yada / teacher123
        teacher_user = User.objects.filter(username="teacher.yada").first()
        if not teacher_user:
            teacher_user = User(username="teacher.yada")
        teacher_user.first_name = "Dr. Yared"
        teacher_user.last_name = "Assefa"
        teacher_user.email = "yared@campushub.edu"
        teacher_user.role = RoleChoices.TEACHER
        teacher_user.staff_id = "FAC-CS-001"
        teacher_user.department = cs_dept
        teacher_user.set_password("teacher123")
        teacher_user.save()

        # Legacy yada account
        yada_user = User.objects.filter(username="yada").first()
        if yada_user:
            yada_user.first_name = yada_user.first_name or "Yared"
            yada_user.last_name = yada_user.last_name or "Assefa"
            yada_user.role = RoleChoices.TEACHER
            yada_user.department = cs_dept
            if not yada_user.staff_id:
                yada_user.staff_id = "FAC-CS-002"
            yada_user.set_password("teacher123")
            yada_user.save()

        # Student 1: student.dave / student123
        dave_user = User.objects.filter(username="student.dave").first()
        if not dave_user:
            dave_user = User(username="student.dave")
        dave_user.first_name = "Dave"
        dave_user.last_name = "Daniel"
        dave_user.email = "dave@campushub.edu"
        dave_user.role = RoleChoices.STUDENT
        dave_user.student_id = "STU-CS-2024-001"
        dave_user.department = cs_dept
        dave_user.gender = GenderChoice.MALE
        dave_user.set_password("student123")
        dave_user.save()

        # Legacy dave account
        legacy_dave = User.objects.filter(username="dave").first()
        if legacy_dave:
            legacy_dave.first_name = legacy_dave.first_name or "Dave"
            legacy_dave.last_name = legacy_dave.last_name or "Daniel"
            legacy_dave.role = RoleChoices.STUDENT
            legacy_dave.department = cs_dept
            if not legacy_dave.student_id:
                legacy_dave.student_id = "STU-CS-2024-002"
            legacy_dave.set_password("student123")
            legacy_dave.save()

        # Student 2: student.ela / student123
        ela_user = User.objects.filter(username="student.ela").first()
        if not ela_user:
            ela_user = User(username="student.ela")
        ela_user.first_name = "Ella"
        ela_user.last_name = "Smith"
        ela_user.email = "ela@campushub.edu"
        ela_user.role = RoleChoices.STUDENT
        ela_user.student_id = "STU-SE-2024-001"
        ela_user.department = se_dept
        ela_user.gender = GenderChoice.FEMALE
        ela_user.set_password("student123")
        ela_user.save()

        # Legacy ela account
        legacy_ela = User.objects.filter(username="ela").first()
        if legacy_ela:
            legacy_ela.first_name = legacy_ela.first_name or "Ella"
            legacy_ela.last_name = legacy_ela.last_name or "Smith"
            legacy_ela.role = RoleChoices.STUDENT
            legacy_ela.department = se_dept
            if not legacy_ela.student_id:
                legacy_ela.student_id = "STU-SE-2024-002"
            legacy_ela.set_password("student123")
            legacy_ela.save()

        self.stdout.write(self.style.SUCCESS("[OK] User accounts synced (admin, teacher.yada, student.dave, student.ela)"))

        # ------------------------------------------------------------
        # 7. Section Assignments
        # ------------------------------------------------------------
        SectionAssignment.objects.get_or_create(
            student=dave_user, semester=fall_sem,
            defaults={"section": sec_cs_a}
        )
        SectionAssignment.objects.get_or_create(
            student=ela_user, semester=fall_sem,
            defaults={"section": sec_se_a}
        )

        # ------------------------------------------------------------
        # 8. Dormitory Assignments
        # ------------------------------------------------------------
        DormitoryAssignment.objects.get_or_create(
            student=dave_user, semester=fall_sem,
            defaults={"dormitory": dorm_m1}
        )
        DormitoryAssignment.objects.get_or_create(
            student=ela_user, semester=fall_sem,
            defaults={"dormitory": dorm_f1}
        )
        self.stdout.write(self.style.SUCCESS("[OK] Section & Dormitory allocations synced"))

        # ------------------------------------------------------------
        # 9. Course Assignments for Teacher (Dr. Yared Assefa)
        # ------------------------------------------------------------
        CourseAssignment.objects.get_or_create(
            course=cs101, teacher=teacher_user, semester=fall_sem,
            defaults={"teaching_role": "Primary Lecturer"}
        )
        CourseAssignment.objects.get_or_create(
            course=cs201, teacher=teacher_user, semester=fall_sem,
            defaults={"teaching_role": "Lead Instructor"}
        )
        self.stdout.write(self.style.SUCCESS("[OK] Course assignments for Dr. Yared Assefa synced"))

        # ------------------------------------------------------------
        # 10. Student Dave: Approved Registration & Graded Enrollments
        # ------------------------------------------------------------
        dave_reg, _ = Registration.objects.get_or_create(
            student=dave_user, semester=fall_sem,
            defaults={"status": RegistrationStatus.APPROVED}
        )
        dave_reg.courses.set([cs101, cs201])
        dave_reg.status = RegistrationStatus.APPROVED
        dave_reg.save()

        enr_cs101, _ = Enrollment.objects.get_or_create(
            student=dave_user, semester=fall_sem, course=cs101
        )
        enr_cs201, _ = Enrollment.objects.get_or_create(
            student=dave_user, semester=fall_sem, course=cs201
        )

        if not enr_cs101.grade:
            GradeSubmission.objects.get_or_create(
                enrollment=enr_cs101,
                submitted_by=teacher_user,
                defaults={"mark": Decimal("92.000")}
            )

        AcademicStatus.update_for_student_and_semester(dave_user, fall_sem)
        self.stdout.write(self.style.SUCCESS("[OK] Dave Daniel registration, enrollment & grade synced"))

        # ------------------------------------------------------------
        # 11. Student Ella: Pending Registration for Admin Approval Testing
        # ------------------------------------------------------------
        ela_reg, _ = Registration.objects.get_or_create(
            student=ela_user, semester=fall_sem,
            defaults={"status": RegistrationStatus.PENDING}
        )
        ela_reg.courses.set([se101, se201])
        ela_reg.status = RegistrationStatus.PENDING
        ela_reg.save()
        self.stdout.write(self.style.SUCCESS("[OK] Ella Smith pending registration ready for Admin approval testing"))

        self.stdout.write(self.style.SUCCESS("\n[SUCCESS] DEMO SEEDING COMPLETED SUCCESSFULLY!"))
        self.stdout.write(
            "Demo Accounts:\n"
            "  Admin:   admin / admin123\n"
            "  Teacher: teacher.yada / teacher123\n"
            "  Student: student.dave / student123\n"
            "  Student: student.ela  / student123\n"
        )
