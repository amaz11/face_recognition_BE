import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import prisma from '../utils/prisma'
import jwt from 'jsonwebtoken'
import erroResponse from "../utils/ErrorResponse";


const examLogPost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const expiry = new Date(body.registration_deadline);
    expiry.setUTCHours(23, 59, 59, 999); // Set time to 23:59:59.999 UTC
    const expiryInSeconds = Math.floor(expiry.getTime() / 1000);

    // Calculate the expiresIn value
    const expiresIn = expiryInSeconds - now;
    if (expiresIn <= 0) {
        next(new erroResponse('The expiration date must be in the future', 400));
    }

    const data = await prisma.exam_log.create({
        data: {
            examId: body.examId,
            exam_year: body.exam_year,
            registration_deadline: body.registration_deadline,
        }
    })
    const day = Math.floor(expiresIn / (3600 * 24));
    const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET_KEY!, {
        expiresIn: `${day}d`
    })

    const tokenData = await prisma.exam_log_token.create({
        data: {
            token,
            examLogId: data.id,
        }
    })

    res.status(201).json({ ok: true, message: "success", data: data, token: tokenData })
})

const examsLogAllGet = asyncHandler(async (req: Request, res: Response) => {
    const data = await prisma.exam_log.findMany({
        include: {
            exam: true,
            exam_held_date_log: true,
            exam_log_token: true
        }
    })
    res.status(200).json(data)
})

const examLogGet = asyncHandler(async (req: Request, res: Response) => {
    const data = await prisma.exam_log.findUnique({
        where: {
            id: +req.params.id,
        },
        include: {
            exam: true,
            exam_held_date_log: true,
            exam_log_token: true
        }
    })

    res.status(201).json(data)
})


const examLogPut = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const expiry = new Date(body.registration_deadline);
    expiry.setUTCHours(23, 59, 59, 999); // Set time to 23:59:59.999 UTC
    const expiryInSeconds = Math.floor(expiry.getTime() / 1000);

    // Calculate the expiresIn value
    const expiresIn = expiryInSeconds - now;
    if (expiresIn <= 0) {
        next(new erroResponse('The expiration date must be in the future', 400));
    }
    const data = await prisma.exam_log.update({
        where: {
            id: +req.params.id,
        },
        data: {
            examId: body.examId,
            exam_year: body.exam_year,
            registration_deadline: body.registration_deadline,
        }
    })

    const day = Math.floor(expiresIn / (3600 * 24));
    const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET_KEY!, {
        expiresIn: `${day}d`
    })

    const tokenData = await prisma.exam_log_token.update({
        where: {
            examLogId: +req.params.id,
        },
        data: {
            token,
            examLogId: data.id,
        }
    })

    res.status(200).json({ ok: true, message: "success", data: data, token: tokenData })

})



const examLogDelete = asyncHandler(async (req: Request, res: Response) => {
    const data = await prisma.exam_log.delete({
        where: {
            id: +req.params.id,
        },
    })

    res.status(200).json(data)
})

export { examLogPost, examsLogAllGet, examLogGet, examLogPut, examLogDelete }