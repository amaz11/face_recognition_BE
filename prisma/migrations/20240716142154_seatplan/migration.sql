/*
  Warnings:

  - You are about to drop the column `exam_date` on the `student_exam_log` table. All the data in the column will be lost.
  - You are about to drop the column `exam_end` on the `student_exam_log` table. All the data in the column will be lost.
  - You are about to drop the column `exam_hallsId` on the `student_exam_log` table. All the data in the column will be lost.
  - You are about to drop the column `exam_logId` on the `student_exam_log` table. All the data in the column will be lost.
  - You are about to drop the column `exam_room` on the `student_exam_log` table. All the data in the column will be lost.
  - You are about to drop the column `exam_start` on the `student_exam_log` table. All the data in the column will be lost.
  - You are about to drop the column `exam_year` on the `student_exam_log` table. All the data in the column will be lost.
  - You are about to drop the column `exam_date` on the `teachers_log` table. All the data in the column will be lost.
  - You are about to drop the column `exam_end` on the `teachers_log` table. All the data in the column will be lost.
  - You are about to drop the column `exam_logId` on the `teachers_log` table. All the data in the column will be lost.
  - You are about to drop the column `exam_room` on the `teachers_log` table. All the data in the column will be lost.
  - You are about to drop the column `exam_start` on the `teachers_log` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[examLogId]` on the table `student_exam_log` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `examLogId` to the `exam_halls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `examLogId` to the `student_exam_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `examLogId` to the `teachers_log` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "student_exam_log" DROP CONSTRAINT "student_exam_log_exam_hallsId_fkey";

-- DropForeignKey
ALTER TABLE "student_exam_log" DROP CONSTRAINT "student_exam_log_exam_logId_fkey";

-- DropForeignKey
ALTER TABLE "teachers_log" DROP CONSTRAINT "teachers_log_exam_hallsId_fkey";

-- DropForeignKey
ALTER TABLE "teachers_log" DROP CONSTRAINT "teachers_log_exam_logId_fkey";

-- DropIndex
DROP INDEX "student_exam_log_exam_logId_key";

-- AlterTable
ALTER TABLE "exam_halls" ADD COLUMN     "examLogId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "exam_log" ADD COLUMN     "exam_date" TEXT,
ADD COLUMN     "exam_end" TEXT,
ADD COLUMN     "exam_start" TEXT;

-- AlterTable
ALTER TABLE "student_exam_log" DROP COLUMN "exam_date",
DROP COLUMN "exam_end",
DROP COLUMN "exam_hallsId",
DROP COLUMN "exam_logId",
DROP COLUMN "exam_room",
DROP COLUMN "exam_start",
DROP COLUMN "exam_year",
ADD COLUMN     "examLogId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "teachers_log" DROP COLUMN "exam_date",
DROP COLUMN "exam_end",
DROP COLUMN "exam_logId",
DROP COLUMN "exam_room",
DROP COLUMN "exam_start",
ADD COLUMN     "examLogId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "hall_rooms" (
    "id" SERIAL NOT NULL,
    "roomNo" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "hallId" INTEGER NOT NULL,

    CONSTRAINT "hall_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seat" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_duty" (
    "id" SERIAL NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "room_duty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_exam_log_examLogId_key" ON "student_exam_log"("examLogId");

-- AddForeignKey
ALTER TABLE "exam_halls" ADD CONSTRAINT "exam_halls_examLogId_fkey" FOREIGN KEY ("examLogId") REFERENCES "exam_log"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hall_rooms" ADD CONSTRAINT "hall_rooms_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "exam_halls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seat" ADD CONSTRAINT "seat_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "hall_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seat" ADD CONSTRAINT "seat_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_exam_log"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers_log" ADD CONSTRAINT "teachers_log_examLogId_fkey" FOREIGN KEY ("examLogId") REFERENCES "exam_log"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_duty" ADD CONSTRAINT "room_duty_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers_log"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_duty" ADD CONSTRAINT "room_duty_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "hall_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_exam_log" ADD CONSTRAINT "student_exam_log_examLogId_fkey" FOREIGN KEY ("examLogId") REFERENCES "exam_log"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
