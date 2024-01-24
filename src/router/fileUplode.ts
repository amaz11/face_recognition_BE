import { Router, Request, Response } from 'express'
import { uploads } from '../utils/fileUpload'
import { PrismaClient } from '@prisma/client';

export const fileUpload = Router()
const prisma = new PrismaClient()

fileUpload.post('/file-upload', uploads.single('fileName'), async (req: Request, res: Response) => {
        try {
                let photoPath = req?.file?.path
                // console.log(photoPath)
                if (photoPath !== undefined) {
                        //  photoPath  = photoPath?.toString()
                        await prisma.photo_path.create({
                                data: {
                                        path: photoPath,
                                }
                        })
                        res.send("upload Seccusfull")

                }
                else {
                        res.send("undefined")

                }


        } catch (error) {
                res.send(error)

        }
})

fileUpload.get("/file-upload", async (req: Request, res: Response) => {
        try {
                const photos = await prisma.photo_path.findMany();
                return res.json(photos);
        } catch (err) {
                res.send(err)
        }
})

