
import { adminVerify } from '../middleware/userVerify'
import { getStudentByExam, getTeacherByExam, loginAdmin, refreshToken, signUpAdmin, updatePassword } from '../controller/adminController'
import { Router } from 'express'
import asyncHandler from '../middleware/asyncHandler'

export const adminRouter = Router()

adminRouter
    .post('/signup', asyncHandler(signUpAdmin))
    .post('/login', asyncHandler(loginAdmin))
    .put('/update/password', asyncHandler(updatePassword))
    .get('/refresh/token', adminVerify, asyncHandler(refreshToken))
    .get('/students/:examId', adminVerify, asyncHandler(getStudentByExam))
    .get('/teachers/:examId', adminVerify, asyncHandler(getTeacherByExam))

