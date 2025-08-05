import { INotificationPublisher } from '../../interfaces/notification-publisher.interface';
import { getRabbitMQChannel } from '../messaging/rabbitmq-connection';
import type { Channel } from 'amqplib';

export class RabbitMQNotificationPublisher implements INotificationPublisher {
  private exchange = 'notifications';
  private routingKey = 'weather.alert.created';

  async publishWeatherAlert(email: string, subject: string, message: string): Promise<void> {
    const channel: Channel = await getRabbitMQChannel();

    await channel.assertExchange(this.exchange, 'topic', { durable: true });

    const payload = {
      data: {
        email,
        subject,
        message,
      },
    };

    const published = channel.publish(
      this.exchange,
      this.routingKey,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true }
    );

    if (!published) {
      console.warn('⚠️ Message was not sent immediately, buffering');
    }

    console.log(`📤 [Publisher] Alert sent to queue for ${email}`);
  }
}
