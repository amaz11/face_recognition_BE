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



// const processUserWithPassword = async (userArr: StudentType[]) => {
//     try {
//         const userWithPassword = await Promise.all(userArr.map(createUserWithPassword))
//         const users = await prisma.$transaction(userWithPassword.map((user: any) => prisma.students.upsert({
//             where: {
//                 email: user.email,
//             },
//             update: {
//                 student_exam_log: {
//                     create: {
//                         exam_date: user.exam_date,
//                         exam_start: user.exam_start,
//                         exam_end: user.exam_end,
//                         exam_room: user.exam_room,
//                         registerNo: user.register_no,
//                         rollNo: user.roll_no,
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
//                         exams: {
//                             connect: {
//                                 name: user.exam_name
//                             }
//                         }
//                     }
//                 }
//             },
//             create: {
//                 name: user.name,
//                 email: user.email,
//                 password: user.password,
//                 phone: user.phone,
//                 address: user.address,
//                 student_exam_log: {
//                     create: {
//                         exam_date: user.exam_date,
//                         exam_start: user.exam_start,
//                         exam_end: user.exam_end,
//                         exam_room: user.exam_room,
//                         registerNo: user.register_no,
//                         rollNo: user.roll_no,
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
//                         exams: {
//                             connect: {
//                                 name: user.exam_name
//                             }
//                         }
//                     }
//                 }
//             },
//             include: {
//                 student_exam_log: {
//                     orderBy: {
//                         id: 'desc'
//                     },
//                     include: {
//                         exams: true,
//                         exam_halls: true,
//                     }
//                 }
//             }
//         })))

//         const emailSendJobs = users.map((user) => {
//             if (user.first_login === true) {
//                 return { name: 'sendEmail', data: { email: user.email, subject: `Here are your login credentials:\nEmail: ${user.email}\nPassword: ${user.password}` }, opts: { removeOnComplete: true } }
//             }
//             else {
//                 return { name: 'sendEmail', data: { email: user.email, subject: `Student, Your ${user.student_exam_log[0].exams.name} Exam will be held on ${user.student_exam_log[0].exam_date}. For more details login in app with previous credentials.` }, opts: { removeOnComplete: true } }
//             }
//         })
//         emailQueue.addBulk(emailSendJobs)
//         return users

//     } catch (error) {
//         return error
//     }
// }

// const createUserWithPassword = async (user: StudentType) => {
//     try {
//         const randomPassword = randomestring.generate(12)
//         const exam_name = user.exam_name.toLocaleUpperCase()

//         return {
//             ...user,
//             password: randomPassword,
//             exam_name,
//         }


//     }
//     catch (error) {
//         return error
//     }
// }

// const createStudents = async (req: Request, res: Response) => {
//     let { exclePath } = req?.body
//     const users: StudentType[] = importFromExcle(exclePath)
//     processUserWithPassword(users).then((data) => { res.json({ success: 'success', data: data }) }).catch(error => {
//         console.error('Error processing users:', error);
//     }).finally(async () => { await prisma.$disconnect() });
// }
