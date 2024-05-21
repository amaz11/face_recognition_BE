import { Router } from 'express'
import asyncHandler from '../middleware/asyncHandler'
import { createLandmark, createStudents, faceRecognition, loginStudent, refreshToken, updatePassword } from '../controller/studentController'
import { studentVerify } from '../middleware/userVerify'


export const students = Router()

students
    .post('/', asyncHandler(createStudents))
    .post('/login', asyncHandler(loginStudent))
    .post('/image/landmark', studentVerify, asyncHandler(createLandmark))
    .get('/image/recognition', studentVerify, asyncHandler(faceRecognition))
    .put('/update/password', studentVerify, asyncHandler(updatePassword))
    .get('/refresh/token', studentVerify, asyncHandler(refreshToken))
