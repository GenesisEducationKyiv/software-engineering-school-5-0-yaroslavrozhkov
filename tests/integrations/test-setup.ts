import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DOCKER_COMPOSE_FILE = 'docker-compose.test.yml';

export const setupTestDatabase = async () => {
  console.log('Starting Docker test DB...');
  execSync(`docker-compose -f ${DOCKER_COMPOSE_FILE} up -d`, { stdio: 'inherit' });

  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('Running Prisma migrate...');
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5435/testdb';
  execSync(`npx prisma migrate deploy`, { stdio: 'inherit' });
};

export const teardownTestDatabase = async () => {
  console.log('Tearing down Docker test DB...');
  await prisma.$disconnect();
  execSync(`docker-compose -f ${DOCKER_COMPOSE_FILE} down`, { stdio: 'inherit' });
};