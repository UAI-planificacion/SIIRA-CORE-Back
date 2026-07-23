-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('PENDING', 'OPENED', 'CLOSED');

-- AlterTable
ALTER TABLE "process_configs" ADD COLUMN     "status" "ProcessStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "description" TEXT;
