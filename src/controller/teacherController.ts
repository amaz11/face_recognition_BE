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
const processUserWithPassword = async (user: UserData[]) => {
    if (user) {
        await Promise.all(user?.map(createUserWithPassword))

        // try {
        //     await Promise.all(userWithPassword.map(async (user: any) => {
        //         await prisma.teachers.create({
        //             data: {
        //                 name: user.name,
        //                 email: user.email,
        //                 password: user.password,
        //                 positions: user.positions,
        //                 phone: user.phone,
        //                 address: user.address,
        //                 teachers_log: {
        //                     create: {
        //                         exams: {
        //                             connect: {
        //                                 name: user.exam_name
        //                             }
        //                         },
        //                         exam_date: user.exam_date,
        //                         exam_start: user.exam_start,
        //                         exam_end: user.exam_end,
        //                         exam_halls: {
        //                             connectOrCreate: {
        //                                 where: {
        //                                     address: user.hall_address,
        //                                 },
        //                                 create: {
        //                                     address: user.hall_address,
        //                                 }
        //                             },

        //                         },
        //                         exam_room: user.room_duty
        //                     },
        //                 }
        //             },
        //         }
        //         )
        //     }))

        // } catch (error) {
        //     console.log(error);
        // }

    }
}



const createUserWithPassword = async (userData: UserData) => {
    try {
        const randomPassword = randomestring.generate(12)
        const exam_name = userData.exam_name.toLocaleUpperCase()
        const user = {
            name: userData.name,
            positions: userData.positions,
            email: userData.email,
            password: randomPassword,
            exam_name,
            phone: userData.phone,
            address: userData.address,
            exam_date: userData.exam_date,
            exam_start: userData.exam_start,
            exam_end: userData.exam_end,
            hall_address: userData.hall_address,
            room_duty: userData.room_duty
        };

        await prisma.teachers.create({
            data: {
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
        }
        )

        // return {
        //     name: user.name,
        //     email: user.email,
        //     password: randomPassword,
        //     positions: user.positions,
        //     phone: user.phone,
        //     address: user.address,
        //     teachers_log: {
        //         create: {
        //             exams: {
        //                 connect: {
        //                     name: exam_name
        //                 }
        //             },
        //             exam_date: user.exam_date,
        //             exam_start: user.exam_start,
        //             exam_end: user.exam_end,
        //             exam_halls: {
        //                 connectOrCreate: {
        //                     where: {
        //                         address: user.hall_address,
        //                     },
        //                     create: {
        //                         address: user.hall_address,
        //                     }
        //                 },

        //             },
        //             exam_room: user.room_duty
        //         },
        //     }
        // }

    }
    catch (error) {
        console.log(error);
    }
}

const createTeacher = async (req: Request, res: Response) => {
    let { exclePath } = req?.body
    const workbook = xlsx.readFile(`${exclePath}`);  // Step 2
    let workbook_sheet = workbook.SheetNames;                // Step 3
    let user: UserData[] = xlsx.utils.sheet_to_json(        // Step 4
        workbook.Sheets[workbook_sheet[0]]
    );
    processUserWithPassword(user).then(() => prisma?.$disconnect()).catch(error => {
        console.error('Error processing users:', error);
        prisma.$disconnect();
    });

    return res.json({ message: 'Success done' })
}


export { createTeacher }