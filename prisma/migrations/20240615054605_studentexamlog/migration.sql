-- DropForeignKey
ALTER TABLE `student_exam_log` DROP FOREIGN KEY `student_exam_log_exam_hallsId_fkey`;

-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `student_exam_log` MODIFY `exam_date` VARCHAR(191) NULL,
    MODIFY `exam_end` VARCHAR(191) NULL,
    MODIFY `exam_hallsId` INTEGER NULL,
    MODIFY `exam_room` VARCHAR(191) NULL,
    MODIFY `exam_start` VARCHAR(191) NULL,
    MODIFY `registerNo` VARCHAR(191) NULL,
    MODIFY `rollNo` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `student_exam_log` ADD CONSTRAINT `student_exam_log_exam_hallsId_fkey` FOREIGN KEY (`exam_hallsId`) REFERENCES `exam_halls`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
