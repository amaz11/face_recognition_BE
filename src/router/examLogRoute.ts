import { adminVerify } from '../middleware/userVerify'
import { examsLogAllGet, examLogDelete, examLogGet, examLogPost, examLogPut } from '../controller/examLogController'
import { Router } from 'express'

export const examsLogRouter = Router()

examsLogRouter
    .post('/', examLogPost)
    .get('/', adminVerify, examsLogAllGet)
    .get('/:id', adminVerify, examLogGet)
    .put('/:id', adminVerify, examLogPut)
    .delete('/:id', adminVerify, examLogDelete)