/*
  Warnings:

  - You are about to drop the column `examId` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `registerNo` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `rollNo` on the `students` table. All the data in the column will be lost.
  - Added the required column `examId` to the `student_exam_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exam_date` to the `student_exam_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exam_end` to the `student_exam_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exam_room` to the `student_exam_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exam_start` to the `student_exam_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registerNo` to the `student_exam_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rollNo` to the `student_exam_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `student_exam_log` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `students` DROP FOREIGN KEY `students_examId_fkey`;

-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `student_exam_log` ADD COLUMN `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `examId` INTEGER NOT NULL,
    ADD COLUMN `exam_date` VARCHAR(191) NOT NULL,
    ADD COLUMN `exam_end` VARCHAR(191) NOT NULL,
    ADD COLUMN `exam_hallsId` INTEGER NULL,
    ADD COLUMN `exam_room` VARCHAR(191) NOT NULL,
    ADD COLUMN `exam_start` VARCHAR(191) NOT NULL,
    ADD COLUMN `registerNo` VARCHAR(191) NOT NULL,
    ADD COLUMN `rollNo` VARCHAR(191) NOT NULL,
    ADD COLUMN `updateAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `students` DROP COLUMN `examId`,
    DROP COLUMN `registerNo`,
    DROP COLUMN `rollNo`;

-- AddForeignKey
ALTER TABLE `student_exam_log` ADD CONSTRAINT `student_exam_log_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_exam_log` ADD CONSTRAINT `student_exam_log_exam_hallsId_fkey` FOREIGN KEY (`exam_hallsId`) REFERENCES `exam_halls`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
