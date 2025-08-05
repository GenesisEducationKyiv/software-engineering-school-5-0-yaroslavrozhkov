/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { connect, Channel } from 'amqplib';

let channel: Channel;

export async function connectRabbitMQ(): Promise<Channel> {
  const url = process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672';
  let connection;
  try {
    connection = await connect(url);
  } catch (error) {
    console.error('❌ Failed to connect to RabbitMQ:', error);
    throw error;
  }
  channel = await connection.createChannel();

  console.log('🐰 [RabbitMQ] Connected');
  return channel;
}

export function getChannel(): Channel {
  if (!channel) throw new Error('❌ RabbitMQ channel not initialized');
  return channel;
}
