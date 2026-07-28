/*
  Warnings:

  - The values [OPENED] on the enum `ProcessStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `academic_period` on the `process_configs` table. All the data in the column will be lost.
  - You are about to drop the column `daily_end_hour` on the `process_configs` table. All the data in the column will be lost.
  - You are about to drop the column `daily_start_hour` on the `process_configs` table. All the data in the column will be lost.
  - You are about to drop the column `draft_end_date` on the `process_configs` table. All the data in the column will be lost.
  - You are about to drop the column `draft_start_date` on the `process_configs` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `process_configs` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `process_configs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[period_id]` on the table `process_configs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `enrollment_end_date` to the `process_configs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enrollment_start_date` to the `process_configs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `period_id` to the `process_configs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planning_end_date` to the `process_configs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planning_start_date` to the `process_configs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProcessStatus_new" AS ENUM ('PENDING', 'PLANNING_STAGE', 'ENROLLMENT_STAGE', 'CLOSED');
ALTER TABLE "public"."process_configs" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "process_configs" ALTER COLUMN "status" TYPE "ProcessStatus_new" USING ("status"::text::"ProcessStatus_new");
ALTER TYPE "ProcessStatus" RENAME TO "ProcessStatus_old";
ALTER TYPE "ProcessStatus_new" RENAME TO "ProcessStatus";
DROP TYPE "public"."ProcessStatus_old";
ALTER TABLE "process_configs" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropIndex
DROP INDEX "process_configs_academic_period_key";

-- AlterTable
ALTER TABLE "process_configs" DROP COLUMN "academic_period",
DROP COLUMN "daily_end_hour",
DROP COLUMN "daily_start_hour",
DROP COLUMN "draft_end_date",
DROP COLUMN "draft_start_date",
DROP COLUMN "end_date",
DROP COLUMN "start_date",
ADD COLUMN     "enrollment_end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "enrollment_start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "period_id" TEXT NOT NULL,
ADD COLUMN     "planning_end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "planning_start_date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "process_configs_period_id_key" ON "process_configs"("period_id");

-- AddForeignKey
ALTER TABLE "process_configs" ADD CONSTRAINT "process_configs_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
