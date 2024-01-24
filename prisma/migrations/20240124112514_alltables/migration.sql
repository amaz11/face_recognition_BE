/*
  Warnings:

  - Added the required column `phone` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `teachers` ADD COLUMN `phone` CHAR(11) NOT NULL;

-- CreateTable
CREATE TABLE `exam_routine` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `examId` INTEGER NOT NULL,
    `examTime` VARCHAR(191) NOT NULL,
    `examDate` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_halls` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adress` VARCHAR(191) NOT NULL,
    `routineId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_room` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomNo` VARCHAR(191) NOT NULL,
    `examHallId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `exam_routine` ADD CONSTRAINT `exam_routine_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exam_halls` ADD CONSTRAINT `exam_halls_routineId_fkey` FOREIGN KEY (`routineId`) REFERENCES `exam_routine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exam_room` ADD CONSTRAINT `exam_room_examHallId_fkey` FOREIGN KEY (`examHallId`) REFERENCES `exam_halls`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
