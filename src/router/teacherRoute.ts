import { createTeacher } from '../controller/teacherController'
import { Router } from 'express'
import asyncHandler from '../middleware/asyncHandler'

export const teachers = Router()

teachers.post('/teachers', asyncHandler(createTeacher))