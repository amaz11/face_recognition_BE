import { createTeacher, loginTeacher, updatePassword } from '../controller/teacherController'
import { Router } from 'express'
import asyncHandler from '../middleware/asyncHandler'

export const teachers = Router()

teachers
    .post('/teachers', asyncHandler(createTeacher))
    .post('/teacher/login', asyncHandler(loginTeacher))
    .put('/teacher/update/password', asyncHandler(updatePassword))
