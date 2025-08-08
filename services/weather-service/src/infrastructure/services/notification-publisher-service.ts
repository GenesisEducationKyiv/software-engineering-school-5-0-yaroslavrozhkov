import { INotificationPublisher } from '../../interfaces/notification-publisher.interface';
import { getRabbitMQChannel } from '../messaging/rabbitmq-connection';
import { logger, messageProcessedCounter, sampleLog } from '@genesishomework/shared-utils/src';
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

    try{
    channel.publish(
      this.exchange,
      this.routingKey,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true }
    );
    
    messageProcessedCounter.inc();

    if (sampleLog(0.1)) {
        logger.info({ email, subject }, `📤 [Publisher] Alert sent to queue for ${email}`);
      }

    } catch (err) {
        logger.error({ err }, '⚠️ Message was not sent immediately, buffering');
    
    }
  }
}
