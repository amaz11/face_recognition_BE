import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import prisma from '../utils/prisma'


const examsPost = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const data = await prisma.exams.create({
        data: {
            name: body.name,
            examTypeId: +body.examTypeId
        }
    })

    res.status(201).json(data)
})

const examsAllGet = asyncHandler(async (req: Request, res: Response) => {
    const data = await prisma.exams.findMany({
        include: {
            exam_type: true
        }
    })
    res.status(200).json(data)
})

const examsGet = asyncHandler(async (req: Request, res: Response) => {
    const data = await prisma.exams.findUnique({
        where: {
            id: +req.params.id,
        },
        include: {
            exam_type: true
        }
    })

    res.status(201).json(data)
})


const examsPut = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const data = await prisma.exams.update({
        where: {
            id: +req.params.id,
        },
        data: {
            name: body.name,
            examTypeId: +body.examTypeId
        }
    })

    res.status(201).json(data)
})


const examsDelete = asyncHandler(async (req: Request, res: Response) => {
    const data = await prisma.exams.delete({
        where: {
            id: +req.params.id,
        },
    })

    res.status(201).json(data)
})

export { examsPost, examsAllGet, examsGet, examsPut, examsDelete }