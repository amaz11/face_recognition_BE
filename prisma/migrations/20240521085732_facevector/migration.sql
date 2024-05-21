-- AlterTable
ALTER TABLE `exams_type` ALTER COLUMN `updateAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `students_face_vectors` MODIFY `faceVector` VARCHAR(1000) NOT NULL;
