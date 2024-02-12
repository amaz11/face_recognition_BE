/*
  Warnings:

  - You are about to drop the column `routineId` on the `exam_halls` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `exam_halls` DROP FOREIGN KEY `exam_halls_routineId_fkey`;

-- AlterTable
ALTER TABLE `exam_halls` DROP COLUMN `routineId`;

-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;
