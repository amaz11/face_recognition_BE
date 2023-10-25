import {Router} from 'express'
import { fileUpload } from './fileUplode'

export const routes = Router()


routes.use(fileUpload)