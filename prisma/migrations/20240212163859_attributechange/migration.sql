/*
  Warnings:

  - You are about to drop the column `adress` on the `exam_halls` table. All the data in the column will be lost.
  - Added the required column `address` to the `exam_halls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `exam_halls` DROP COLUMN `adress`,
    ADD COLUMN `address` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;
