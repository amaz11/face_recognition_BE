-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `teachers` MODIFY `name` VARCHAR(100) NULL,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(100) NULL,
    MODIFY `phone` CHAR(11) NULL,
    MODIFY `password` VARCHAR(191) NULL,
    MODIFY `positions` VARCHAR(50) NULL;
