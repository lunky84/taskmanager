-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "priority" INTEGER DEFAULT 1,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT E'Pending';
