import { Request, Response } from 'express'
import { importFromExcle } from '../utils/importFromExcle';
import prisma from '../utils/prisma'
import randomestring from 'randomstring'
import { StudentType } from '../types/student';
import { compare, hash } from 'bcryptjs'
import { tokenGenerator } from '../utils/jwtToken';
import * as faceapi from 'face-api.js';
import canvas from 'canvas';
import path from "path";

const processUserWithPassword = async (userArr: StudentType[]) => {
    try {
        const userWithPassword = await Promise.all(userArr.map(createUserWithPassword))
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

        return {
            ...user,
            password: randomPassword,
            exam_name,
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


const loginStudent = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(403).json({ ok: false, message: "Please fill the form" })
    }
    const user = await prisma.students.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        return res.status(403).json({ ok: false, message: "Invalid email or password" })
    }

    const comparePassword = await compare(password, user.password);

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
    const user = await prisma.students.findUnique({
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
        await prisma.students.update({
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

const refreshToken = async (req: Request, res: Response) => {
    const user = (req as any).user
    const token = tokenGenerator(user)
    return res.status(200).json({ ok: true, message: 'susccess', token })

}

const createLandmark = async (req: Request, res: Response) => {
    const { imagePath } = req.body; // Get the path of the uploaded image file
    const id = (req as any).user.id
    if (!imagePath) {
        return res.status(403).json({ ok: false, message: "Image path is invalid" })
    }

    try {
        const img = await canvas.loadImage(path.join(__dirname, '../..', imagePath)); // Load image from the specified path
        const detection: any = await faceapi.detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) {
            res.status(403).json({ ok: false, message: "Provide Valid Image" })
        }
        const descriptor = JSON.stringify(detection.descriptor);
        const userFaceDescriptor = await prisma.students_face_vectors.create({
            data: {
                studentId: id,
                faceVector: descriptor
            }
        })
        res.status(200).json(userFaceDescriptor);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing image');
    }
}

const faceRecognition = async (req: Request, res: Response) => {
    const { imagePath } = req.body; // Get the path of the uploaded image file
    const id = (req as any).user.id
    const users = await prisma.students_face_vectors.findMany({
        where: {
            studentId: id,
        },
        include: {
            student: true
        }
    })
    // const student: StudentUser = user

    try {
        const img = await canvas.loadImage(path.join(__dirname, '../..', imagePath)); // Load image from the specified path
        const detection: any = await faceapi.detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) {
            return res.status(400).send('No face detected.');
        }

        const labeledDescriptors = users.map((user: any) => {
            const descriptor = JSON.parse(user.faceVector);
            const descriptorArray: any = Object.values(descriptor);
            const float32ArrayDescriptor = new Float32Array(descriptorArray);
            return new faceapi.LabeledFaceDescriptors(user.student.name, [float32ArrayDescriptor]);
        });

        // console.log(labeledDescriptors);
        const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
        const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
        res.status(200).json({ bestMatch })
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing image');
    }

}

export { createStudents, loginStudent, updatePassword, refreshToken, createLandmark, faceRecognition }