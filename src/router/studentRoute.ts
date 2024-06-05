import { Router } from 'express'
import asyncHandler from '../middleware/asyncHandler'
import { createLandmark, createStudents, faceDescriptor, faceRecognition, loginStudent, postImagePaths, refreshToken, updatePassword } from '../controller/studentController'
import { studentVerify } from '../middleware/userVerify'


export const students = Router()

students
    .post('/', asyncHandler(createStudents))
    .post('/login', asyncHandler(loginStudent))
    .post('/face/descriptor', studentVerify, asyncHandler(faceDescriptor))
    .post('/face/image', studentVerify, asyncHandler(postImagePaths))
    .post('/image/landmark', studentVerify, asyncHandler(createLandmark))
    .get('/image/recognition', studentVerify, asyncHandler(faceRecognition))
    .put('/update/password', studentVerify, asyncHandler(updatePassword))
    .get('/refresh/token', studentVerify, asyncHandler(refreshToken))
