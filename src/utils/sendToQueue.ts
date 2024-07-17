import { connectRabbitMQ } from "./rabbitMQConnection";


export const sendToQueue = async (queue: string, msg: any) => {
    const { channel } = await connectRabbitMQ() as any;
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(msg));
    setTimeout(() => {
        channel.connection.close();
    }, 500);
}