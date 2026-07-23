/*
  Warnings:

  - You are about to drop the column `closingDate` on the `periods` table. All the data in the column will be lost.
  - You are about to drop the column `costCenterId` on the `periods` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `periods` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `periods` table. All the data in the column will be lost.
  - You are about to drop the column `openingDate` on the `periods` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `periods` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `periods` table. All the data in the column will be lost.
  - Added the required column `cost_center_id` to the `periods` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `periods` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `periods` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `periods` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "periods" DROP COLUMN "closingDate",
DROP COLUMN "costCenterId",
DROP COLUMN "createdAt",
DROP COLUMN "endDate",
DROP COLUMN "openingDate",
DROP COLUMN "startDate",
DROP COLUMN "updatedAt",
ADD COLUMN     "closing_date" TIMESTAMP(3),
ADD COLUMN     "cost_center_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "opening_date" TIMESTAMP(3),
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
