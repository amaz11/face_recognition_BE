import nodemailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config();

export const sendEmail = async (email: string, subject: string) => {
    let transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        service: process.env.SMPT_SERVICE,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMPT_MAIL, // Your email address
            pass: process.env.SMPT_PASSWORD, // Your email password
        },
    });

    await transporter.sendMail({
        from: process.env.SMPT_MAIL,
        to: email,
        subject: 'FaceRecognition base Exam',
        text: subject,
    });
}