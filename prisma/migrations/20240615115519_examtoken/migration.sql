/*
  Warnings:

  - The primary key for the `exam_log_token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `exam_log_token` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[examLogId]` on the table `exam_log_token` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `exam_log_token` DROP PRIMARY KEY,
    DROP COLUMN `id`;

-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `exam_log_token_examLogId_key` ON `exam_log_token`(`examLogId`);
