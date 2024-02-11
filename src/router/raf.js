const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();

async function createUser(user) {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Create user in the database
        const createdUser = await prisma.user.create({
            data: {
                name: user.Name,
                email: user.email,
                password: hashedPassword, // Store hashed password
            },
        });

        // Send email to user with credentials
        await sendEmail(user.email, user.password);

        console.log('User created and email sent successfully:', createdUser);
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

async function sendEmail(email, password) {
    // Create reusable transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'your_email@example.com', // Your email address
            pass: 'your_password', // Your email password
        },
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Your Name" <your_email@example.com>', // Sender address
        to: email, // List of receivers
        subject: 'Your Credentials', // Subject line
        text: `Here are your login credentials:\nEmail: ${email}\nPassword: ${password}`, // Plain text body
    });

    console.log('Message sent: %s', info.messageId);
}

async function processUsers(users) {
    for (const user of users) {
        await createUser(user);
    }
}

const usersData = [
    {
        "Name": "Dulce",
        "email": "dulce@gmail.com",
        "password": "password1",
    },
    // Add more user data as needed
];

processUsers(usersData)
    .then(() => prisma.$disconnect())
    .catch(error => {
        console.error('Error processing users:', error);
        prisma.$disconnect();
    });