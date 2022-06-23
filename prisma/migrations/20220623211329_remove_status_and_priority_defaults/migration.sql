/*
  Warnings:

  - Made the column `priority` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "priority" SET NOT NULL,
ALTER COLUMN "priority" DROP DEFAULT,
ALTER COLUMN "status" DROP DEFAULT;
