/*
  Warnings:

  - Added the required column `phone` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `students` ADD COLUMN `phone` VARCHAR(11) NOT NULL;
