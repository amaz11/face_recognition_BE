import { Request, Response } from 'express'
import { importFromExcle } from '../utils/importFromExcle';
import prisma from '../utils/prisma'
import randomestring from 'randomstring'
import { StudentType } from '../types/student';

const processUserWithPassword = async (userArr: StudentType[]) => {
    try {
        const userWithPassword = await Promise.all(userArr?.map(createUserWithPassword))
        const users = await prisma.$transaction(userWithPassword.map((user: any) => prisma.students.upsert({
            where: {
                email: user.email,
            },
            update: {
                student_exam_log: {
                    create: {
                        exam_date: user.exam_date,
                        exam_start: user.exam_start,
                        exam_end: user.exam_end,
                        exam_room: user.exam_room,
                        registerNo: user.register_no,
                        rollNo: user.roll_no,
                        exam_halls: {
                            connectOrCreate: {
                                where: {
                                    address: user.hall_address,
                                },
                                create: {
                                    address: user.hall_address,
                                }
                            },
                        },
                        exams: {
                            connect: {
                                name: user.exam_name
                            }
                        }
                    }
                }
            },
            create: {
                name: user.name,
                email: user.email,
                password: user.password,
                phone: user.phone,
                address: user.address,
                student_exam_log: {
                    create: {
                        exam_date: user.exam_date,
                        exam_start: user.exam_start,
                        exam_end: user.exam_end,
                        exam_room: user.exam_room,
                        registerNo: user.register_no,
                        rollNo: user.roll_no,
                        exam_halls: {
                            connectOrCreate: {
                                where: {
                                    address: user.hall_address,
                                },
                                create: {
                                    address: user.hall_address,
                                }
                            },
                        },
                        exams: {
                            connect: {
                                name: user.exam_name
                            }
                        }
                    }
                }
            },
            include: {
                student_exam_log: {
                    include: {
                        exams: true,
                        exam_halls: true,
                    }
                }
            }
        })))

        return users
    } catch (error) {
        return error
    }
}


const createUserWithPassword = async (user: StudentType) => {
    try {
        const randomPassword = randomestring.generate(12)
        const exam_name = user.exam_name.toLocaleUpperCase()
        // const exam_name = userData.exam_name.toLocaleUpperCase()

        return {
            ...user,
            password: randomPassword,
            exam_name
        }


    }
    catch (error) {
        return error
    }
}


const createStudents = async (req: Request, res: Response) => {
    let { exclePath } = req?.body
    const users: StudentType[] = importFromExcle(exclePath)
    processUserWithPassword(users).then((data) => { res.json({ success: 'success', data: data }) }).catch(error => {
        console.error('Error processing users:', error);
    }).finally(async () => { await prisma.$disconnect() });
}

export { createStudents }