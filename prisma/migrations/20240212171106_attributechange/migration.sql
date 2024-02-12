/*
  Warnings:

  - Added the required column `exam_date` to the `teachers_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exam_end` to the `teachers_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exam_start` to the `teachers_log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `teachers_log` ADD COLUMN `exam_date` VARCHAR(191) NOT NULL,
    ADD COLUMN `exam_end` VARCHAR(191) NOT NULL,
    ADD COLUMN `exam_start` VARCHAR(191) NOT NULL;
