/*
  Warnings:

  - The values [COMMUNIC,GARAGE] on the enum `SpaceType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SpaceType_new" AS ENUM ('ROOM', 'STUDY_ROOM', 'MEETING_ROOM', 'POSTGRADUATE_ROOM', 'AUDITORIO', 'LAB', 'LABPC', 'DIS', 'CORE', 'MULTIPURPOSE');
ALTER TABLE "subjects" ALTER COLUMN "space_type" TYPE "SpaceType_new" USING ("space_type"::text::"SpaceType_new");
ALTER TABLE "sections" ALTER COLUMN "space_type" TYPE "SpaceType_new" USING ("space_type"::text::"SpaceType_new");
ALTER TYPE "SpaceType" RENAME TO "SpaceType_old";
ALTER TYPE "SpaceType_new" RENAME TO "SpaceType";
DROP TYPE "public"."SpaceType_old";
COMMIT;
