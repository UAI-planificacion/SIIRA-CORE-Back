-- CreateEnum
CREATE TYPE "SubjectStatus" AS ENUM ('APPROVED', 'FAILED', 'IN_PROGRESS', 'CREDITED');

-- AlterTable
ALTER TABLE "career_plan_subjects" ADD COLUMN     "prerequisites" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "student_subject_history" (
    "id" TEXT NOT NULL,
    "status" "SubjectStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "final_grade" DOUBLE PRECISION,
    "period_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_subject_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_subject_history_student_id_subject_id_period_id_key" ON "student_subject_history"("student_id", "subject_id", "period_id");

-- AddForeignKey
ALTER TABLE "student_subject_history" ADD CONSTRAINT "student_subject_history_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_subject_history" ADD CONSTRAINT "student_subject_history_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_subject_history" ADD CONSTRAINT "student_subject_history_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
