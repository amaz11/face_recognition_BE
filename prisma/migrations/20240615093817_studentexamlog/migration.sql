/*
  Warnings:

  - A unique constraint covering the columns `[exam_logId]` on the table `student_exam_log` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `student_exam_log_exam_logId_key` ON `student_exam_log`(`exam_logId`);
