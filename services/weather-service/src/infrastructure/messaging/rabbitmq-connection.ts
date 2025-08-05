/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import amqplib, { Channel } from 'amqplib';

let channel: Channel;

export async function getRabbitMQChannel(): Promise<Channel> {
  if (channel) return channel;

  const connection = await amqplib.connect(process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672');
  channel = await connection.createChannel();

  console.log('🐇 [RabbitMQ] Channel connected');
  return channel;
}
