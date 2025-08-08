import { connect, Channel } from 'amqplib';
import { logger } from '@genesishomework/shared-utils/src';

let channel: Channel;

export async function connectRabbitMQ(): Promise<Channel> {
  const url = process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672';
  let connection;
  try {
    connection = await connect(url);
  } catch (error) {
    logger.error('❌ Failed to connect to RabbitMQ:', error);
    throw error;
  }
  channel = await connection.createChannel();
  logger.info('✅ Connected to RabbitMQ');
  return channel;
}

export function getChannel(): Channel {
  if (!channel) throw new Error('❌ RabbitMQ channel not initialized');
  return channel;
}
