/*
  Warnings:

  - Made the column `exam_hallsId` on table `student_exam_log` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `teachers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `teachers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `teachers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `teachers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `teachers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `positions` on table `teachers` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `student_exam_log` DROP FOREIGN KEY `student_exam_log_exam_hallsId_fkey`;

-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `student_exam_log` MODIFY `exam_hallsId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `teachers` MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `address` VARCHAR(100) NOT NULL,
    MODIFY `phone` CHAR(11) NOT NULL,
    MODIFY `password` VARCHAR(191) NOT NULL,
    MODIFY `positions` VARCHAR(50) NOT NULL;

-- AddForeignKey
ALTER TABLE `student_exam_log` ADD CONSTRAINT `student_exam_log_exam_hallsId_fkey` FOREIGN KEY (`exam_hallsId`) REFERENCES `exam_halls`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
