import { Router } from 'express'
import asyncHandler from '../middleware/asyncHandler'
import { createLandmark, existingStudentExam, faceDescriptor, faceRecognition, loginStudent, postImagePaths, profiledasboard, refreshToken, signupStudent, updatePassword } from '../controller/studentController'
import { studentVerify } from '../middleware/userVerify'


export const students = Router()

students
    // .post('/', asyncHandler(createStudents))
    .post('/singup/:token', asyncHandler(signupStudent))
    .post('/exist/student/exam/:token', asyncHandler(existingStudentExam))
    .post('/login', asyncHandler(loginStudent))
    .post('/face/descriptor', studentVerify, asyncHandler(faceDescriptor))
    .post('/face/image', studentVerify, asyncHandler(postImagePaths))
    .post('/image/landmark', studentVerify, asyncHandler(createLandmark))
    .get("/profile/dashboard", studentVerify, asyncHandler(profiledasboard))
    .get('/image/recognition', studentVerify, asyncHandler(faceRecognition))
    .put('/update/password', studentVerify, asyncHandler(updatePassword))
    .get('/refresh/token', studentVerify, asyncHandler(refreshToken))
