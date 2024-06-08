import { NextFunction, Request, Response } from 'express'
import { importFromExcle } from '../utils/importFromExcle';
import prisma from '../utils/prisma'
import randomestring from 'randomstring'
import { StudentType } from '../types/student';
import { compare, hash } from 'bcryptjs'
import { tokenGenerator } from '../utils/jwtToken';
import * as faceapi from 'face-api.js';
import canvas from 'canvas';
import path from "path";
import { emailQueue } from '../index';
import erroResponse from '../utils/ErrorResponse';
import crypto from 'crypto'
import { sendEmail } from '../utils/sendEmail';
import jwt from 'jsonwebtoken'

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
                    orderBy: {
                        id: 'desc'
                    },
                    include: {
                        exams: true,
                        exam_halls: true,
                    }
                }
            }
        })))

        const emailSendJobs = users.map((user) => {
            if (user.first_login === true) {
                return { name: 'sendEmail', data: { email: user.email, subject: `Here are your login credentials:\nEmail: ${user.email}\nPassword: ${user.password}` }, opts: { removeOnComplete: true } }
            }
            else {
                return { name: 'sendEmail', data: { email: user.email, subject: `Student, Your ${user.student_exam_log[0].exams.name} Exam will be held on ${user.student_exam_log[0].exam_date}. For more details login in app with previous credentials.` }, opts: { removeOnComplete: true } }
            }
        })
        emailQueue.addBulk(emailSendJobs)
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

const faceDescriptor = async (req: Request, res: Response) => {
    const { faceVector } = req.body
    const id = (req as any).user.id
    const faceVectorToString = faceVector.toString()
    const newFaceDescriptor = await prisma.students_face_vectors.create({
        data: {
            faceVector: faceVectorToString,
            studentId: id,
        }
    })
    return res.status(201).json(newFaceDescriptor)
}

const postImagePaths = async (req: Request, res: Response) => {
    const { faceVector } = req.body
    const id = (req as any).user.id
    const newFaceDescriptor = await prisma.students_face_vectors.create({
        data: {
            faceVector: faceVector,
            studentId: id,
        }
    })
    return res.status(201).json(newFaceDescriptor)
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


// Forgot Password / routes /forget/password
const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.students.findUnique({
        where: {
            email: req.body.email
        }
    });
    if (!user) {
        return next(new erroResponse("User Not Fouund", 400));
    }

    const resetToken = tokenGenerator(user)
    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
    )}/password-reset/${resetToken}`;

    const message = `Your Reset url: \n\n ${resetPasswordUrl} \n\n If not then ignor it `;
    try {
        await sendEmail(user.email, message);

        return res.status(200).json({
            success: true,
            message: `Email send to ${user.email} successfully`,
        });
    } catch (error: any) {

        return next(new erroResponse(error.massage, 500));
    }
};


//reset Password // routes /password/reset/:token
const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    // creating token hash
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY!);
    if (!decoded) {
        return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    if (req.body.password !== req.body.conpassword) {
        return next(new erroResponse("Password not match", 400));
    }
    const passwordBcrypt = await hash(req.body.password, 10)

    await prisma.students.update({
        where: {
            id: (decoded as any).id,
        },
        data: {
            password: passwordBcrypt,
            first_login: false,
        }
    })
    return res.status(200).json({ ok: true, message: 'susccess' })
};


export { createStudents, loginStudent, updatePassword, refreshToken, createLandmark, faceRecognition, faceDescriptor, postImagePaths, forgotPassword, resetPassword }