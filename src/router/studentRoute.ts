import { Router } from 'express'
import asyncHandler from '../middleware/asyncHandler'
import { createStudents } from '../controller/studentController'

export const students = Router()

students.post('/teachers', asyncHandler(createStudents))