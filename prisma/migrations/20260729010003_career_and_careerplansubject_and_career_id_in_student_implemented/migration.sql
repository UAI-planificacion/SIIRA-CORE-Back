/*
  Warnings:

  - Added the required column `career_id` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "PeriodType" ADD VALUE 'BIMESTRAL';

-- AlterTable
ALTER TABLE "process_configs" ALTER COLUMN "total_real_students" DROP NOT NULL,
ALTER COLUMN "total_real_students" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "career_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "careers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "careers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_plan_subjects" (
    "id" TEXT NOT NULL,
    "career_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "semester_number" INTEGER NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_plan_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "careers_code_key" ON "careers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "career_plan_subjects_career_id_subject_id_key" ON "career_plan_subjects"("career_id", "subject_id");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "careers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_plan_subjects" ADD CONSTRAINT "career_plan_subjects_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "careers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_plan_subjects" ADD CONSTRAINT "career_plan_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
