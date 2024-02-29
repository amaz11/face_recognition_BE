-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `students` ADD COLUMN `first_login` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `teachers` ADD COLUMN `first_login` BOOLEAN NOT NULL DEFAULT true;
