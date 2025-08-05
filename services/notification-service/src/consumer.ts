/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { getChannel } from './rabbitmq';
import { IEmailService } from './interfaces/email-service.interface';

export async function startConsumers(emailService: IEmailService): Promise<void> {
  try {
    const channel = getChannel();
    const exchange = 'notifications';
    const routingKey = 'weather.alert.created';
    const queue = 'notification.weather.alert';

    await channel.assertExchange(exchange, 'topic', { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);

    console.log(`📬 [Consumer] Waiting for messages on queue "${queue}"...`);

    await channel.consume(queue, async (msg) => {
      if (!msg) {
        console.warn('⚠️ [Consumer] Received null or undefined message');
        return;
      }

      try {
        const payload = JSON.parse(msg.content.toString());
        const { email, subject, message } = payload.data;

        console.log(`📨 [Consumer] Received alert for ${email}`);
        await emailService.send(email, subject, message);

        channel.ack(msg);
      } catch (err) {
        console.error('❌ [Consumer] Failed to process message:', err);
        channel.nack(msg, false, false);
      }
    });
  } catch (err) {
    console.error('❌ [Consumer] Failed to start consumers:', err);
    throw err;
  }
}