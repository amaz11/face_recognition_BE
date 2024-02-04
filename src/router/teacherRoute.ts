import { createTeacher } from '../controller/teacherController'
import { Router } from 'express'
import { uploadExcles } from '../utils/fileUpload'
import asyncHandler from '../middleware/asyncHandler'

export const teachers = Router()

teachers.post('/teachers', uploadExcles.single('teachers'), asyncHandler(createTeacher))