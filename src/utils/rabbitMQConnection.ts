import amqp from 'amqplib';
export const connectRabbitMQ = async (retries = 5) => {
    while (retries) {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL!);
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
            throw error;
        }
    }
}