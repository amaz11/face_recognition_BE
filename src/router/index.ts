import { Router } from 'express'
import { fileUpload } from './fileUplode'
import { examTypeRouter } from './examTypeRoute'
import { examsRouter } from './examsRoute'
import { teachers } from './teacherRoute'

export const routes = Router()


routes.use(fileUpload)
routes.use(examTypeRouter)
routes.use(examsRouter)
routes.use(teachers)
