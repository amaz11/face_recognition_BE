import { Router } from 'express'
import asyncHandler from '../middleware/asyncHandler'
import { createStudents, loginStudent, updatePassword } from '../controller/studentController'
import { studentVerify } from '../middleware/userVerify'


export const students = Router()

students
    .post('/students', asyncHandler(createStudents))
    .post('/student/login', asyncHandler(loginStudent))
    .put('/student/update/password', studentVerify, asyncHandler(updatePassword))