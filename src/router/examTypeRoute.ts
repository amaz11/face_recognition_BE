import { examTypeAllGet, examTypeDelete, examTypeGet, examTypePost, examTypePut } from '../controller/examsType'
import { Router } from 'express'

export const examTypeRouter = Router()

examTypeRouter
    .post('/examsType', examTypePost)
    .get('/examsType', examTypeAllGet)
    .get('/examsType/:id', examTypeGet)
    .put('/examsType/:id', examTypePut)
    .delete('/examsType/:id', examTypeDelete)