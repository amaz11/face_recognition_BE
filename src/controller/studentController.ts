import { NextFunction, Request, Response } from 'express'
import prisma from '../utils/prisma'
import { compare, genSalt, hash } from 'bcryptjs'
import { tokenGenerator } from '../utils/jwtToken';
import * as faceapi from 'face-api.js';
import canvas from 'canvas';
import path from "path";
import erroResponse from '../utils/ErrorResponse';
import { sendEmail } from '../utils/sendEmail';
import jwt from 'jsonwebtoken'



const signupStudent = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, conpassword, address, phone } = await req.body;
    console.log(req.body);
    if (!name || !email || !password || !conpassword || !address || !phone) {
        return next(new erroResponse("Fill The Form", 400));
    }

    if (password !== conpassword) {
        return next(new erroResponse("Password And confirm Password don't match", 400));
    }
    const decoded = jwt.verify(req.params.token.toString(), process.env.JWT_SECRET_KEY!);
    if (!decoded) {
        return res.status(400).json({ error: "Invalid Token" });
    }

    const findStudent = await prisma.students.findUnique({
        where: {
            email
        }
    })
    if (!findStudent) {
        const salt = await genSalt(10);
        const cryptoPassword = await hash(password, salt);
        const student = await prisma.students.create({
            data: {
                name,
                email,
                address,
                phone,
                password: cryptoPassword,
                student_exam_log: {
                    create: {
                        examLogId: (decoded as any).id
                    }
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                password: false,
                phone: true,
                first_login: true,
                registretionDone: true,
                varify: true,
                createAt: true,
                updateAt: true,
            }
        })
        return res.status(201).json({ ok: true, message: "success", data: student })
    }
    return res.status(201).json({ ok: true, message: "User Already exist with this email", })



}


const existingStudentExam = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body
    const decoded = jwt.verify(req.params.token.toString(), process.env.JWT_SECRET_KEY!);
    if (!decoded) {
        return res.status(401).json({ error: "Invalid Token" });
    }
    const findStudent = await prisma.students.findUnique({
        where: {
            email
        }
    })
    if (!findStudent) {
        return next(new erroResponse("User don't exist with this email", 400))
    }

    const examLog = await prisma.student_exam_log.findUnique({
        where: {
            examLogId: (decoded as any).id
        }
    })

    if (examLog) {
        return next(new erroResponse("You already apply for this exam", 400))

    }

    const student = await prisma.students.update({
        where: { email },
        data: {
            student_exam_log: {
                create: {
                    examLogId: (decoded as any).id
                }
            }
        }
    })

    return res.status(201).json({ ok: true, message: "success", data: student })
}

const loginStudent = async (req: Request, res: Response) => {
    const { email, password, examId } = req.body;
    if (!email || !password) {
        return res.status(403).json({ ok: false, message: "Please fill the form" })
    }
    const user = await prisma.students.findUnique({
        where: {
            email,
        },
        include: {
            student_exam_log: {
                where: {
                    exam_log: {
                        exam: {
                            id: examId
                        }
                    }
                },
                include: {
                    exam_log: {
                        include: {
                            exam: true
                        }
                    }
                }
            }
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

const profiledasboard = async (req: Request, res: Response) => {
    const { examId } = req.body
    const id = (req as any).user.id
    const student = await prisma.students.findUnique({
        where: {
            id,
        },
        include: {
            student_exam_log: {
                where: {
                    exam_log: {
                        exam: {
                            id: examId
                        }
                    }
                },
                include: {
                    exam_log: {
                        include: {
                            exam: true
                        }
                    }
                }
            }
        }
    })
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
    const { faceVector } = await req.body
    const id = (req as any).user.id
    const faceVectorToString = faceVector.toString()
    await prisma.students_face_vectors.create({
        data: {
            faceVector: faceVectorToString,
            studentId: id,
        }
    })
    return res.status(201).json({ status: 201, ok: true, message: 'susccess' })
}

const postImagePaths = async (req: Request, res: Response, next: NextFunction) => {
    const { images } = req.body
    const id = (req as any).user.id

    if (images.length === 3) {
        await prisma.photo_path.createMany({
            data: images?.map(
                ({ image, descriptorId }: { image: string, descriptorId: number }) => ({
                    image,
                    studentId: id,
                    descriptorId
                })
            )
        })
        return res.status(201).json({ ok: true, message: 'susccess', status: 201 })
    }
    else {
        return next(new erroResponse("There must be 3 images, not more or less.", 400))
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

export { //createStudents, 
    signupStudent, existingStudentExam, loginStudent, updatePassword, refreshToken, createLandmark, faceRecognition, faceDescriptor, postImagePaths, forgotPassword, resetPassword, profiledasboard
}