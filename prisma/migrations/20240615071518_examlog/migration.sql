/*
  Warnings:

  - You are about to drop the column `examId` on the `student_exam_log` table. All the data in the column will be lost.
  - You are about to drop the column `examId` on the `teachers_log` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `student_exam_log` DROP FOREIGN KEY `student_exam_log_examId_fkey`;

-- DropForeignKey
ALTER TABLE `teachers_log` DROP FOREIGN KEY `teachers_log_examId_fkey`;

-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `student_exam_log` DROP COLUMN `examId`,
    ADD COLUMN `exam_logId` INTEGER NULL,
    ADD COLUMN `exam_year` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `teachers_log` DROP COLUMN `examId`,
    ADD COLUMN `exam_logId` INTEGER NULL;

-- CreateTable
CREATE TABLE `exam_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `examId` INTEGER NOT NULL,
    `exam_year` VARCHAR(4) NOT NULL,
    `registration_deadline` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `exam_log` ADD CONSTRAINT `exam_log_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teachers_log` ADD CONSTRAINT `teachers_log_exam_logId_fkey` FOREIGN KEY (`exam_logId`) REFERENCES `exam_log`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_exam_log` ADD CONSTRAINT `student_exam_log_exam_logId_fkey` FOREIGN KEY (`exam_logId`) REFERENCES `exam_log`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
