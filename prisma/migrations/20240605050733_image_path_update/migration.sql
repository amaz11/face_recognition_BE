/*
  Warnings:

  - Added the required column `studentId` to the `photo_path` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `photo_path` ADD COLUMN `studentId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `photo_path` ADD CONSTRAINT `photo_path_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
