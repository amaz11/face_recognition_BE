-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `teachers_log` ADD COLUMN `exam_hallsId` INTEGER NULL;

-- CreateTable
CREATE TABLE `_exam_roomToteachers_log` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_exam_roomToteachers_log_AB_unique`(`A`, `B`),
    INDEX `_exam_roomToteachers_log_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `teachers_log` ADD CONSTRAINT `teachers_log_exam_hallsId_fkey` FOREIGN KEY (`exam_hallsId`) REFERENCES `exam_halls`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_exam_roomToteachers_log` ADD CONSTRAINT `_exam_roomToteachers_log_A_fkey` FOREIGN KEY (`A`) REFERENCES `exam_room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_exam_roomToteachers_log` ADD CONSTRAINT `_exam_roomToteachers_log_B_fkey` FOREIGN KEY (`B`) REFERENCES `teachers_log`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
