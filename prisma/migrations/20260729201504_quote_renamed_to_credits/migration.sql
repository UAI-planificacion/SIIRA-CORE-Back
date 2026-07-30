/*
  Warnings:

  - You are about to drop the column `quota` on the `subjects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "quota",
ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 3;
