import { Job } from "bullmq";
// src/worker.js
import { Worker } from 'bullmq';
// const sendEmail = require('./sendEmail');
import dotenv from 'dotenv';
import { sendEmail } from "./utils/sendEmail";

dotenv.config();

const worker = new Worker('emailQueue', async (job: Job) => {
    const { email, subject, } = job.data;
    // await sendEmail(to, subject, text);
    await sendEmail(email, subject)

    console.log("It's Work");
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT!,
    }
});


worker.on('completed', (job: Job) => {
    console.log(`Job ${job.id} completed!`);
});

worker.on('failed', (job: any, err: any) => {
    console.error(`Job ${job.id} failed: ${err.message}`);
    // return
});
