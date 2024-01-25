import { examsAllGet, examsDelete, examsGet, examsPost, examsPut } from '../controller/examsController'
import { Router } from 'express'

export const examsRouter = Router()

examsRouter
    .post('/exams', examsPost)
    .get('/exams', examsAllGet)
    .get('/exams/:id', examsGet)
    .put('/exams/:id', examsPut)
    .delete('/exams/:id', examsDelete)