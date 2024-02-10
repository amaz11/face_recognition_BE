import nodemailer from "nodemailer";
export const sendEmail = async (email: string, password: string) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'your_email@example.com', // Your email address
            pass: 'your_password', // Your email password
        },
    });

    await transporter.sendMail({
        from: '"Your Name" <your_email@example.com>',
        to: email,
        subject: 'Your Credentials',
        text: `Here are your login credentials:\nEmail: ${email}\nPassword: ${password}`,
    });
}