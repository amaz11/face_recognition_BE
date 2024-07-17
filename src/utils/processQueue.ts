import prisma from './prisma'
import { sendEmail } from './sendEmail';
import { connectRabbitMQ } from './rabbitMQConnection';
export const processQueue = async (messageCount: number, onComplete: any) => {
    let pendingMessages = 0;
    try {
        const { connection, channel } = await connectRabbitMQ() as any;

        channel.consume('user_creation', async (msg: any) => {
            if (msg !== null) {
                const { email, password, name, address, phone, positions, examLogId } = JSON.parse(msg.content.toString());
                try {
                    // Check if user with the same email already exists
                    const existingUser = await prisma.teachers.findUnique({ where: { email } });

                    if (existingUser) {
                        // console.log(`Duplicate email found: ${email}, skipping user`);
                        const teacherLog = await prisma.teachers_log.findMany({
                            where: {
                                AND: [
                                    { teacherId: existingUser.id },
                                    { examLogId: 1 }
                                ]

                            }
                        })
                        if (teacherLog.length === 0) {

                            await prisma.teachers_log.create({
                                data: {
                                    teacherId: existingUser.id,
                                    examLogId: 1
                                }
                            })
                            // console.log(`Teacher log created for ${existingUser.email}`);
                        }

                        channel.ack(msg); // Acknowledge the message to remove it from the queue
                        return; // Skip duplicate
                    }

                    const createdUser = await prisma.teachers.create(
                        {
                            data: {
                                email,
                                name,
                                address,
                                password,
                                phone,
                                positions,
                                teachers_log: {
                                    create: {
                                        examLogId: 1
                                    }
                                }
                            }
                        }
                    );
                    const message = `A teacher user account has been created.\n Email:${createdUser.email} \n password: ${password}`
                    await sendEmail(createdUser.email, message);
                    channel.ack(msg);
                }
                catch (error) {
                    console.error('Error processing user:', error);
                    channel.nack(msg); // Requeue the message
                    throw error;
                } finally {
                    pendingMessages--;
                    if (pendingMessages === 0) {
                        onComplete();
                        channel.close();
                        connection.close();
                    } else {

                    }
                }
            }
        });
        pendingMessages = messageCount;
    }
    catch (error) {
        console.error('Error starting worker:', error);
        throw error;
    }
}


