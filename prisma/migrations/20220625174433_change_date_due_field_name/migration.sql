/*
  Warnings:

  - You are about to drop the column `dateDue` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "dateDue",
ADD COLUMN     "date_due" TIMESTAMP(3);
