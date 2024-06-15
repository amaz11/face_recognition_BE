import { Router } from 'express'
import { examTypeRouter } from './examTypeRoute'
import { examsRouter } from './examsRoute'
import { teachers } from './teacherRoute'
import { fileUploadRouter } from './fileUplodeRoute'
import { students } from './studentRoute'
import { adminRouter } from './adminRoute'
import { examsLogRouter } from './examLogRoute'

export const routes = Router()


routes.use(fileUploadRouter)
routes.use('/examsType', examTypeRouter)
routes.use('/exams', examsRouter)
routes.use('/exam/log', examsLogRouter)
routes.use('/teachers', teachers)
routes.use('/students', students)
routes.use('/admin', adminRouter)