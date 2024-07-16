/*
  Warnings:

  - You are about to drop the column `path` on the `photo_path` table. All the data in the column will be lost.
  - Added the required column `image` to the `photo_path` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "photo_path" DROP COLUMN "path",
ADD COLUMN     "image" TEXT NOT NULL;
