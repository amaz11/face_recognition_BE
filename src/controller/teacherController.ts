import { Request, Response } from 'express'
import * as xlsx from 'xlsx'
import prisma from '../utils/prisma'
import randomestring from 'randomstring'
import { importFromExcle } from '../utils/importFromExcle';
import { TeacherType } from '../types/teacher';
import { compare, hash } from 'bcryptjs'
import { tokenGenerator } from '../utils/jwtToken';
import { StudentQueryParams } from '../types/student';
import { sendToQueue } from '../utils/rabbitMQ';
import { processQueue } from '../utils/processQueue';


const BATCH_SIZE = 5;
async function createUsersInBatches(users: TeacherType[], examLogId: number) {
    let messageCount = 0;

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
        const batch = users.slice(i, i + BATCH_SIZE);
        for (const user of batch) {
            const password = randomestring.generate(12);
            await sendToQueue('user_creation', JSON.stringify({
                email: user.email,
                password,
                name: user.name,
                address: user.address,
                phone: user.phone,
                positions: user.positions,
                examLogId
            }));
            messageCount++;
        }
        console.log(`Batch ${i / BATCH_SIZE + 1} queued`);
    }
    return messageCount
}

const createTeacher = async (req: Request, res: Response) => {
    let { exclePath, examLogId } = req?.body
    const teachers: TeacherType[] = importFromExcle(exclePath)
    const messageCount = await createUsersInBatches(teachers, examLogId)
    if (messageCount === 0) {
        return res.status(200).json({ message: 'No users to process' });
    }
    processQueue(messageCount, () => {
        return res.status(200).json({ message: 'All teachers processed' })
    }).catch(error => {
        console.error('Error starting worker:', error);
        return res.status(500).json({ error: 'Error processing queue' })
    });
}


const loginTeacher = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(403).json({ ok: false, message: "Please fill the form" })
    }

    const user = await prisma.teachers.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        return res.status(403).json({ ok: false, message: "Invalid email or password" })
    }

    const comparePassword = await compare(password, user.password)

    if (user.password === password || comparePassword) {
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
    const user = await prisma.teachers.findUnique({
        where: {
            id
        }
    })

    const comparePassword = await compare(oldPassword, user!.password);

    if (user!.password === oldPassword || comparePassword) {

        if (newPassword !== confirmPassword) {
            return res.status(200).json({ ok: true, message: 'Password do not match' })
        }

        const passwordBcrypt = await hash(newPassword, 10)
        await prisma.teachers.update({
            where: {
                id
            },
            data: {
                password: passwordBcrypt,
                first_login: false,
            }
        })
        return res.status(200).json({ ok: true, message: 'susccess' })
    }
    return res.status(404).json({ ok: false, message: "Invalid password" })

}

const getStudentsByRoom = async (req: Request, res: Response) => {
    const { roomNo, hall_address, date }: StudentQueryParams = req.query as unknown as StudentQueryParams
    // const data = await prisma.student_exam_log.findMany({
    //     where: {
    //         // exam_date: date,
    //         exam_room: roomNo,
    //         exam_halls: {
    //             address: hall_address.toLocaleUpperCase()
    //         }
    //     }
    // })
    // res.status(200).json({ data })
}

const refreshToken = async (req: Request, res: Response) => {
    const user = (req as any).user
    const token = tokenGenerator(user)
    return res.status(200).json({ ok: true, message: 'susccess', token })

}

export {
    createTeacher,
    loginTeacher, updatePassword, getStudentsByRoom, refreshToken
}