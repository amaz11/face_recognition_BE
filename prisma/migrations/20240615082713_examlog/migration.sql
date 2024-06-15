/*
  Warnings:

  - You are about to drop the column `token` on the `exam_log` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `exam_log` DROP COLUMN `token`;

-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;

-- CreateTable
CREATE TABLE `exam_held_date_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` VARCHAR(191) NOT NULL,
    `examId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_log_token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `examLogId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `exam_held_date_log` ADD CONSTRAINT `exam_held_date_log_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exam_log`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exam_log_token` ADD CONSTRAINT `exam_log_token_examLogId_fkey` FOREIGN KEY (`examLogId`) REFERENCES `exam_log`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
