/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `exam_halls` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `exam_halls_address_key` ON `exam_halls`(`address`);
