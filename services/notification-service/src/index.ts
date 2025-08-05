import { connectRabbitMQ } from './rabbitmq';
import { startConsumers } from './consumer';
import { HttpEmailService } from './infrastracture/services/email-service';

async function start() {
  try {
    await connectRabbitMQ();
    
    const emailService = new HttpEmailService("http://localhost:3000/email");
    
    await startConsumers(emailService);
  } catch (err) {
    console.error('❌ [Startup] Failed to start service:', err);
    process.exit(1);
  }
}

start();
