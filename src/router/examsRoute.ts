import { adminVerify } from '../middleware/userVerify'
import { examsAllGet, examsDelete, examsGet, examsPost, examsPut } from '../controller/examsController'
import { Router } from 'express'

export const examsRouter = Router()

examsRouter
    .post('/', adminVerify, examsPost)
    .get('/', adminVerify, examsAllGet)
    .get('/:id', adminVerify, examsGet)
    .put('/:id', adminVerify, examsPut)
    .delete('/:id', adminVerify, examsDelete)