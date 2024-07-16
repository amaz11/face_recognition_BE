-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'ADMIN');

-- CreateTable
CREATE TABLE "exams_type" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exams_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exams" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "examTypeId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_log" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "exam_year" VARCHAR(4) NOT NULL,
    "registration_deadline" TEXT NOT NULL,

    CONSTRAINT "exam_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_held_date_log" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "examId" INTEGER NOT NULL,

    CONSTRAINT "exam_held_date_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_log_token" (
    "token" TEXT NOT NULL,
    "examLogId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "exam_routine" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "examTime" TEXT NOT NULL,
    "examDate" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_routine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_halls" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "exam_halls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "positions" VARCHAR(50) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" CHAR(11) NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "first_login" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers_log" (
    "id" SERIAL NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "exam_hallsId" INTEGER,
    "exam_room" TEXT NOT NULL,
    "exam_date" TEXT NOT NULL,
    "exam_start" TEXT NOT NULL,
    "exam_end" TEXT NOT NULL,
    "exam_logId" INTEGER,

    CONSTRAINT "teachers_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" TEXT NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "password" TEXT NOT NULL,
    "phone" VARCHAR(11) NOT NULL,
    "first_login" BOOLEAN NOT NULL DEFAULT true,
    "registretionDone" BOOLEAN NOT NULL DEFAULT false,
    "varify" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_exam_log" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "rollNo" TEXT,
    "registerNo" TEXT,
    "exam_hallsId" INTEGER,
    "exam_room" TEXT,
    "exam_date" TEXT,
    "exam_year" TEXT,
    "exam_start" TEXT,
    "exam_end" TEXT,
    "exam_logId" INTEGER,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_exam_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students_face_vectors" (
    "id" SERIAL NOT NULL,
    "faceVector" TEXT NOT NULL,
    "studentId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_face_vectors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo_path" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "photo_path_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" TEXT NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "password" TEXT NOT NULL,
    "phone" VARCHAR(11) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exams_name_key" ON "exams"("name");

-- CreateIndex
CREATE UNIQUE INDEX "exam_log_token_examLogId_key" ON "exam_log_token"("examLogId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_halls_address_key" ON "exam_halls"("address");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_email_key" ON "teachers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_exam_log_exam_logId_key" ON "student_exam_log"("exam_logId");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_examTypeId_fkey" FOREIGN KEY ("examTypeId") REFERENCES "exams_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_log" ADD CONSTRAINT "exam_log_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_held_date_log" ADD CONSTRAINT "exam_held_date_log_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exam_log"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_log_token" ADD CONSTRAINT "exam_log_token_examLogId_fkey" FOREIGN KEY ("examLogId") REFERENCES "exam_log"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_routine" ADD CONSTRAINT "exam_routine_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers_log" ADD CONSTRAINT "teachers_log_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers_log" ADD CONSTRAINT "teachers_log_exam_hallsId_fkey" FOREIGN KEY ("exam_hallsId") REFERENCES "exam_halls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers_log" ADD CONSTRAINT "teachers_log_exam_logId_fkey" FOREIGN KEY ("exam_logId") REFERENCES "exam_log"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_exam_log" ADD CONSTRAINT "student_exam_log_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_exam_log" ADD CONSTRAINT "student_exam_log_exam_hallsId_fkey" FOREIGN KEY ("exam_hallsId") REFERENCES "exam_halls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_exam_log" ADD CONSTRAINT "student_exam_log_exam_logId_fkey" FOREIGN KEY ("exam_logId") REFERENCES "exam_log"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students_face_vectors" ADD CONSTRAINT "students_face_vectors_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo_path" ADD CONSTRAINT "photo_path_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
