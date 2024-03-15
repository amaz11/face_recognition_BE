import { adminVerify } from '../middleware/userVerify'
import { examTypeAllGet, examTypeDelete, examTypeGet, examTypePost, examTypePut } from '../controller/examsType'
import { Router } from 'express'

export const examTypeRouter = Router()

examTypeRouter
    .post('/', adminVerify, examTypePost)
    .get('/', adminVerify, examTypeAllGet)
    .get('/:id', adminVerify, examTypeGet)
    .put('/:id', adminVerify, examTypePut)
    .delete('/:id', adminVerify, examTypeDelete)