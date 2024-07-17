const express = require('express');
const XLSX = require('xlsx');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const amqp = require('amqplib');

const app = express();
const prisma = new PrismaClient();
const BATCH_SIZE = 1000; // Adjust as needed
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const PORT = 3000;

// Set Up Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

function generatePassword() {
    return crypto.randomBytes(8).toString('hex'); // Generates a 16-character password
}

async function sendEmail(to, password) {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to,
        subject: 'Your new account',
        text: `Your password is: ${password}`
    };

    await transporter.sendMail(mailOptions);
}

async function connectRabbitMQ(retries = 5) {
    while (retries) {
        try {
            const connection = await amqp.connect(RABBITMQ_URL);
            const channel = await connection.createChannel();
            await channel.assertQueue('user_creation', { durable: true });

            console.log('Connected to RabbitMQ and queue asserted');
            return { connection, channel };
        } catch (error) {
            console.error('Error connecting to RabbitMQ, retrying...', error);
            retries -= 1;
            if (!retries) {
                console.error('Max retries reached, exiting...');
                process.exit(1); // Exit the process with an error code
            }
            await new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds before retrying
        }
    }
}

async function sendToQueue(queue, msg) {
    const { channel } = await connectRabbitMQ();
    await channel.sendToQueue(queue, Buffer.from(msg));
    setTimeout(() => {
        channel.connection.close();
    }, 500);
}

async function createUsersInBatches(users) {
    let messageCount = 0;
    const sendToQueuePromises = [];

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
        const batch = users.slice(i, i + BATCH_SIZE);
        for (const user of batch) {
            const password = generatePassword();
            sendToQueuePromises.push(sendToQueue('user_creation', JSON.stringify({ email: user.email, password })));
            messageCount++;
        }
        console.log(`Batch ${i / BATCH_SIZE + 1} queued`);
    }

    await Promise.all(sendToQueuePromises);
    return messageCount;
}

async function processQueue(onComplete) {
    try {
        const { connection, channel } = await connectRabbitMQ();
        let pendingMessages = 0;

        channel.consume('user_creation', async (msg) => {
            if (msg !== null) {
                const { email, password } = JSON.parse(msg.content.toString());
                try {
                    const existingUser = await prisma.user.findUnique({ where: { email } });

                    if (existingUser) {
                        console.log(`Duplicate email found: ${email}, skipping user`);
                        channel.ack(msg); // Acknowledge the message to remove it from the queue
                    } else {
                        const createdUser = await prisma.user.create({
                            data: {
                                email,
                                password
                            }
                        });

                        await sendEmail(createdUser.email, password);
                        channel.ack(msg);
                    }
                } catch (error) {
                    console.error('Error processing user:', error);
                    channel.nack(msg); // Requeue the message
                } finally {
                    pendingMessages--;
                    if (pendingMessages === 0) {
                        onComplete();
                        channel.close();
                        connection.close();
                    }
                }
            }
        });

        pendingMessages = await channel.checkQueue('user_creation').then((queue) => queue.messageCount);
    } catch (error) {
        console.error('Error starting worker:', error);
    }
}

// Start the processQueue function
// processQueue(() => {
//     console.log('Worker started and will notify when complete');
// }).catch(error => console.error('Error starting worker:', error));

// HTTP Endpoint to Trigger the Process
app.post('/upload', async (req, res) => {
    try {
        const workbook = XLSX.readFile('path/to/your/excel/file.xlsx');
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const users = XLSX.utils.sheet_to_json(sheet);

        const messageCount = await createUsersInBatches(users);

        if (messageCount === 0) {
            return res.status(200).json({ message: 'No users to process' });
        }

        processQueue(() => {
            res.status(200).json({ message: 'All users processed' });
        }).catch(error => {
            console.error('Error starting worker:', error);
            res.status(500).json({ error: 'Error processing queue' });
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


const fun1 = async () => {
    try {
        // code 

    } catch (error) {
        // fun1 error 
    }
}


const fun2 = async () => {
    try {
        await fun1();
    } catch (error) {
        // fun2 error 
    }
}