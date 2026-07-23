-- CreateEnum
CREATE TYPE "PeriodStatus" AS ENUM ('Pending', 'InProgress', 'Opened', 'Closed');

-- CreateEnum
CREATE TYPE "PeriodType" AS ENUM ('ANUAL', 'TRIMESTRAL', 'SEMESTRAL', 'VERANO');

-- CreateEnum
CREATE TYPE "Building" AS ENUM ('PREGRADO_A', 'PREGRADO_B', 'POSTGRADO_C', 'TALLERES_D', 'TALLERES_E', 'PREGRADO_F', 'ERRAZURIZ', 'VITACURA', 'VINA_A', 'VINA_B', 'VINA_C', 'VINA_D', 'VINA_E', 'VINA_F', 'Z');

-- CreateEnum
CREATE TYPE "SpaceType" AS ENUM ('ROOM', 'AUDITORIO', 'COMMUNIC', 'LAB', 'LABPC', 'DIS', 'GARAGE', 'CORE');

-- CreateEnum
CREATE TYPE "SessionCode" AS ENUM ('C', 'A', 'T', 'L');

-- CreateEnum
CREATE TYPE "SizeValue" AS ENUM ('XS', 'XE', 'S', 'SE', 'MS', 'M', 'L', 'XL', 'XXL');

-- CreateEnum
CREATE TYPE "ModuleDifference" AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('PROCESSING', 'CONFIRMED', 'REJECTED');

-- CreateTable
CREATE TABLE "process_configs" (
    "id" TEXT NOT NULL,
    "academic_period" TEXT NOT NULL,
    "total_real_students" INTEGER NOT NULL,
    "draft_start_date" TIMESTAMP(3) NOT NULL,
    "draft_end_date" TIMESTAMP(3) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "daily_start_hour" INTEGER NOT NULL,
    "daily_end_hour" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "process_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "rut" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "priority_start_at" TIMESTAMP(3) NOT NULL,
    "max_credits_limit" INTEGER NOT NULL DEFAULT 30,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "periods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "costCenterId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "openingDate" TIMESTAMP(3),
    "closingDate" TIMESTAMP(3),
    "status" "PeriodStatus" NOT NULL DEFAULT 'InProgress',
    "type" "PeriodType" NOT NULL DEFAULT 'SEMESTRAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "is_mock" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "difference" "ModuleDifference",
    "start_hour" TEXT NOT NULL,
    "end_hour" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "space_type" "SpaceType",
    "quota" INTEGER DEFAULT 0,
    "space_size_id" "SizeValue",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "semester" INTEGER,
    "is_closed" BOOLEAN NOT NULL DEFAULT false,
    "group_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "space_type" "SpaceType",
    "registered" INTEGER DEFAULT 0,
    "building" "Building",
    "quota" INTEGER NOT NULL,
    "period_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "name" "SessionCode" NOT NULL,
    "space_id" TEXT,
    "chairs_available" INTEGER,
    "is_english" BOOLEAN NOT NULL DEFAULT false,
    "date" TIMESTAMP(3) NOT NULL,
    "section_id" TEXT NOT NULL,
    "professor_id" TEXT,
    "module_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sizes" (
    "id" "SizeValue" NOT NULL,
    "detail" TEXT NOT NULL,
    "min" INTEGER,
    "max" INTEGER,
    "less_than" INTEGER,
    "greater_than" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_plan_templates" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "freeze" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_plan_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_plan_details" (
    "id" TEXT NOT NULL,
    "study_plan_template_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_plan_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL,
    "ticket_id" TEXT NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'PROCESSING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "session_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "process_configs_academic_period_key" ON "process_configs"("academic_period");

-- CreateIndex
CREATE UNIQUE INDEX "students_rut_key" ON "students"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE INDEX "periods_name_idx" ON "periods"("name");

-- CreateIndex
CREATE UNIQUE INDEX "professors_email_key" ON "professors"("email");

-- CreateIndex
CREATE INDEX "professors_name_idx" ON "professors"("name");

-- CreateIndex
CREATE INDEX "modules_code_idx" ON "modules"("code");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_name_key" ON "subjects"("name");

-- CreateIndex
CREATE INDEX "subjects_name_idx" ON "subjects"("name");

-- CreateIndex
CREATE INDEX "study_plan_templates_student_id_idx" ON "study_plan_templates"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_ticket_id_key" ON "enrollments"("ticket_id");

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_space_size_id_fkey" FOREIGN KEY ("space_size_id") REFERENCES "sizes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plan_templates" ADD CONSTRAINT "study_plan_templates_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plan_details" ADD CONSTRAINT "study_plan_details_study_plan_template_id_fkey" FOREIGN KEY ("study_plan_template_id") REFERENCES "study_plan_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plan_details" ADD CONSTRAINT "study_plan_details_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
