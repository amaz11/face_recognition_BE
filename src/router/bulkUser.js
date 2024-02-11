const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();

async function createUserWithPassword(user) {
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return {
            name: user.Name,
            email: user.email,
            password: hashedPassword,
        };
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

async function sendEmail(email, password) {
    let transporter = nodemailer.createTransport({
        // Your SMTP configuration
    });

    let info = await transporter.sendMail({
        from: '"Your Name" <your_email@example.com>',
        to: email,
        subject: 'Your Credentials',
        text: `Here are your login credentials:\nEmail: ${email}\nPassword: ${password}`,
    });

    console.log('Message sent: %s', info.messageId);
}

async function processUsersWithPasswords(users) {
    const usersWithPasswords = await Promise.all(users.map(createUserWithPassword));

    try {
        await prisma.user.createMany({
            data: usersWithPasswords,
        });
        console.log('Bulk user creation successful');

        for (const user of users) {
            const { email, password } = user;
            await sendEmail(email, password);
        }
        console.log('Emails sent successfully');
    } catch (error) {
        console.error('Error creating users in bulk:', error);
        throw error;
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

processUsersWithPasswords(usersData)
    .then(() => prisma.$disconnect())
    .catch(error => {
        console.error('Error processing users:', error);
        prisma.$disconnect();
    });