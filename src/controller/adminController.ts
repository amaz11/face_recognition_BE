import { Request, Response } from "express";
import prisma from '../utils/prisma'
import { tokenGenerator } from "../utils/jwtToken";
import { compare, hash } from "bcryptjs";

const signUpAdmin = async (req: Request, res: Response) => {
    const { name, email, address, password, phone, role } = req.body;
    if (!name || !email || !password || !address || !phone) {
        return res.status(403).json({ ok: false, message: "Please fill the form" })
    }
    const user = await prisma.admin.findUnique({
        where: {
            email
        }
    })
    if (user) {
        return res.status(403).json({ ok: false, message: "User already exist with this email" })
    }

    const passwordBcrypt = await hash(password, 10)
    const createUser = await prisma.admin.create({
        data: {
            name,
            address,
            email,
            password: passwordBcrypt,
            phone,
            role
        },
        select: {
            name: true,
            address: true,
            email: true,
            password: false,
            phone: true,
            role: true
        }
    })
    return res.status(200).json({ ok: true, message: 'susccess', data: createUser })

}

const loginAdmin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(403).json({ ok: false, message: "Please fill the form" })
    }
    const user = await prisma.admin.findUnique({
        where: {
            email
        }
    })
    if (!user) {
        return res.status(403).json({ ok: false, message: "Invalid email or password" })
    }

    const comparePassword = await compare(password, user.password);

    if (comparePassword) {
        const token = tokenGenerator(user)
        const userWithoutPassword = {
            ...user,
            password: ''
        }
        return res.status(200).json({ ok: true, message: 'susccess', data: userWithoutPassword, token: token })
    }

    return res.status(403).json({ ok: false, message: "Invalid email or password" })
}

const updatePassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const id = (req as any).user.id
    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(403).json({ ok: false, message: "Please fill the form" })
    }
    const user = await prisma.admin.findUnique({
        where: {
            id
        }
    })

    const comparePassword = await compare(oldPassword, user!.password);

    if (comparePassword) {

        if (newPassword !== confirmPassword) {
            return res.status(200).json({ ok: true, message: 'Password do not match' })
        }

        const passwordBcrypt = await hash(newPassword, 10)
        await prisma.admin.update({
            where: {
                id
            },
            data: {
                password: passwordBcrypt,
            }
        })
        return res.status(200).json({ ok: true, message: 'susccess' })
    }
    return res.status(404).json({ ok: false, message: "Invalid password" })
}

const refreshToken = async (req: Request, res: Response) => {
    const user = (req as any).user
    const token = tokenGenerator(user)
    return res.status(200).json({ ok: true, message: 'susccess', token })

}


const getStudentByExam = async (req: Request, res: Response) => {
    let examId = req.params.examId as any
    examId = Number(examId)
    const data = await prisma.student_exam_log.findMany({
        where: {
            examId
        }
    })
    res.status(200).json({ ok: true, message: 'susccess', data, count: data.length })
}

const getTeacherByExam = async (req: Request, res: Response) => {
    let examId = req.params.examId as any
    examId = Number(examId)
    const data = await prisma.teachers_log.findMany({
        where: {
            examId
        }
    })
    res.status(200).json({ ok: true, message: 'susccess', data, count: data.length })
}

export { signUpAdmin, loginAdmin, updatePassword, refreshToken, getStudentByExam, getTeacherByExam }