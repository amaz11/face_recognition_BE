import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import prisma from '../utils/prisma'


const examTypePost = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const data = await prisma.exams_type.create({
        data: {
            name: body.name,
        }
    })

    res.status(201).json(data)
})

const examTypeAllGet = asyncHandler(async (req: Request, res: Response) => {
    const data = await prisma.exams_type.findMany()
    res.status(200).json(data)
})

const examTypeGet = asyncHandler(async (req: Request, res: Response) => {
    const data = await prisma.exams_type.findUnique({
        where: {
            id: +req.params.id,
        },

    })

    res.status(200).json({ data, status: true })
})


const examTypePut = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const data = await prisma.exams_type.update({
        where: {
            id: +req.params.id,
        },
        data: {
            name: body.name,
        }
    })

    res.status(204).json({ data, status: true, message: "Update succesful" })
})


const examTypeDelete = asyncHandler(async (req: Request, res: Response) => {
    const data = await prisma.exams_type.delete({
        where: {
            id: +req.params.id,
        },
    })

    res.status(204).json({ status: true, message: "Delete succesful" })
})

export { examTypePost, examTypeAllGet, examTypeGet, examTypePut, examTypeDelete }