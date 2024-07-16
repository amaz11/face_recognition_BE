/*
  Warnings:

  - Added the required column `descriptorId` to the `photo_path` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "photo_path" ADD COLUMN     "descriptorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "photo_path" ADD CONSTRAINT "photo_path_descriptorId_fkey" FOREIGN KEY ("descriptorId") REFERENCES "students_face_vectors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
