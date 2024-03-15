import { createTeacher, getStudentsByRoom, loginTeacher, refreshToken, updatePassword } from '../controller/teacherController'
import { Router } from 'express'
import asyncHandler from '../middleware/asyncHandler'
import { teacherVerify } from '../middleware/userVerify'

export const teachers = Router()

teachers
    .post('/', asyncHandler(createTeacher))
    .post('/login', asyncHandler(loginTeacher))
    .put('/update/password', teacherVerify, asyncHandler(updatePassword))
    .get('/room/students', teacherVerify, asyncHandler(getStudentsByRoom))
    .get('/refresh/token', teacherVerify, asyncHandler(refreshToken))
