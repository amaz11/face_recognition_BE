import { createTeacher, getStudentsByRoom, loginTeacher, updatePassword } from '../controller/teacherController'
import { Router } from 'express'
import asyncHandler from '../middleware/asyncHandler'
import { teacherVerify } from '../middleware/userVerify'

export const teachers = Router()

teachers
    .post('/teachers', asyncHandler(createTeacher))
    .post('/teacher/login', asyncHandler(loginTeacher))
    .put('/teacher/update/password', teacherVerify, asyncHandler(updatePassword))
    .get('/room/students', teacherVerify, asyncHandler(getStudentsByRoom))