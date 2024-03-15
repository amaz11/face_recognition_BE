import { Router } from 'express'
import asyncHandler from '../middleware/asyncHandler'
import { createStudents, loginStudent, refreshToken, updatePassword } from '../controller/studentController'
import { studentVerify } from '../middleware/userVerify'


export const students = Router()

students
    .post('/', asyncHandler(createStudents))
    .post('/login', asyncHandler(loginStudent))
    .put('/update/password', studentVerify, asyncHandler(updatePassword))
    .get('/refresh/token', studentVerify, asyncHandler(refreshToken))