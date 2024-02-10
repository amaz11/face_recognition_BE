/*
  Warnings:

  - Added the required column `password` to the `teachers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positions` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `teachers` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `positions` VARCHAR(50) NOT NULL;
