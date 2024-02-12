/*
  Warnings:

  - A unique constraint covering the columns `[roomNo]` on the table `exam_room` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `exam_room_roomNo_key` ON `exam_room`(`roomNo`);
