import { Router } from 'express'
import { examTypeRouter } from './examTypeRoute'
import { examsRouter } from './examsRoute'
import { teachers } from './teacherRoute'
import { fileUploadRouter } from './fileUplodeRoute'
import { students } from './studentRoute'

export const routes = Router()


routes.use(fileUploadRouter)
routes.use(examTypeRouter)
routes.use(examsRouter)
routes.use(teachers)
routes.use(students)
