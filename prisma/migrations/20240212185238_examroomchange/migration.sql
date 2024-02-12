/*
  Warnings:

  - You are about to drop the `_exam_roomtoteachers_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exam_room` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `exam_room` to the `teachers_log` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_exam_roomtoteachers_log` DROP FOREIGN KEY `_exam_roomToteachers_log_A_fkey`;

-- DropForeignKey
ALTER TABLE `_exam_roomtoteachers_log` DROP FOREIGN KEY `_exam_roomToteachers_log_B_fkey`;

-- DropForeignKey
ALTER TABLE `exam_room` DROP FOREIGN KEY `exam_room_examHallId_fkey`;

-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `teachers_log` ADD COLUMN `exam_room` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_exam_roomtoteachers_log`;

-- DropTable
DROP TABLE `exam_room`;
