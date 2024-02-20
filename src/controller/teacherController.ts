import { Request, Response } from 'express'
import * as xlsx from 'xlsx'
import prisma from '../utils/prisma'
import randomestring from 'randomstring'

interface UserData {
    name: string;
    email: string;
    password: string;
    address: string;
    positions: string;
    phone: string
    room_duty: string;
    exam_name: string
    exam_date: string;
    exam_start: string;
    exam_end: string;
    hall_address: string
}
const processUserWithPassword = async (userArr: UserData[]) => {
    try {
        const userWithPassword = await Promise.all(userArr?.map(createUserWithPassword))
        const users = await prisma.$transaction(userWithPassword.map((user: any) => prisma.teachers.upsert({
            where: {
                email: user.email,

            },
            update: {
                teachers_log: {
                    create: {
                        exams: {
                            connect: {
                                name: user.exam_name
                            }
                        },
                        exam_date: user.exam_date,
                        exam_start: user.exam_start,
                        exam_end: user.exam_end,
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
                        exam_room: user.room_duty
                    },
                }
            },
            create: {
                name: user.name,
                email: user.email,
                password: user.password,
                positions: user.positions,
                phone: user.phone,
                address: user.address,
                teachers_log: {
                    create: {
                        exams: {
                            connect: {
                                name: user.exam_name
                            }
                        },
                        exam_date: user.exam_date,
                        exam_start: user.exam_start,
                        exam_end: user.exam_end,
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
                        exam_room: user.room_duty
                    },
                }
            },
            include: {
                teachers_log: {
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


const createUserWithPassword = async (user: UserData) => {
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

const createTeacher = async (req: Request, res: Response) => {
    let { exclePath } = req?.body
    const workbook = xlsx.readFile(`${exclePath}`);  // Step 2
    let workbook_sheet = workbook.SheetNames;                // Step 3
    let user: UserData[] = xlsx.utils.sheet_to_json(        // Step 4
        workbook.Sheets[workbook_sheet[0]]
    );
    processUserWithPassword(user).then((data) => { res.json({ success: 'success', data: data }) }).catch(error => {
        console.error('Error processing users:', error);
    }).finally(async () => { await prisma.$disconnect() });
}


export { createTeacher }