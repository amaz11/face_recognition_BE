import { uploadExcles, uploadImgs } from '../utils/fileUpload'
import { excleFilePath, imageFilePath } from '../controller/fileUploadController'
import { Router } from 'express'
import asyncHandler from '../middleware/asyncHandler'

export const fileUploadRouter = Router()

fileUploadRouter
    .post('/excle/upload', uploadExcles.single('excle'), asyncHandler(excleFilePath))
    .post('/image/upload', uploadImgs.single('image'), asyncHandler(imageFilePath))