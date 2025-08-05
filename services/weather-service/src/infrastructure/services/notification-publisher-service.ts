import { INotificationPublisher } from '../../interfaces/notification-publisher.interface';
import { getRabbitMQChannel } from '../messaging/rabbitmq-connection';

export class RabbitMQNotificationPublisher implements INotificationPublisher {
  private exchange = 'notifications';
  private routingKey = 'weather.alert.created';

  async publishWeatherAlert(email: string, subject: string, message: string): Promise<void> {
    const channel = await getRabbitMQChannel();

    await channel.assertExchange(this.exchange, 'topic', { durable: true });

    const payload = {
      data: {
        email,
        subject,
        message,
      },
    };

    channel.publish(
      this.exchange,
      this.routingKey,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true }
    );

    console.log(`📤 [Publisher] Alert sent to queue for ${email}`);
  }
}
