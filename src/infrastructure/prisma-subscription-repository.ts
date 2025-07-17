import { PrismaClient } from "@prisma/client";
import { ISubscriptionRepository } from "../interfaces/subscription-repository.interface";
import { StoredSubscription } from "../models/types";

const prisma = new PrismaClient();

export class PrismaSubscriptionRepository implements ISubscriptionRepository {
  async findByEmailAndCity(email: string, city: string) {
    return prisma.subscription.findFirst({ where: { email, city } });
  }

  async create(email: string, city: string, frequency: number, token: string) {
    await prisma.subscription.create({
      data: { email, city, frequency, token },
    });
  }

  async findByToken(token: string) {
    return prisma.subscription.findUnique({ where: { token } });
  }

  async confirm(token: string) {
    await prisma.subscription.update({
      where: { token },
      data: { confirmed: true },
    });
  }

  async deleteByToken(token: string) {
    await prisma.subscription.delete({ where: { token } });
  }

  async getConfirmed(): Promise<StoredSubscription[]> {
    return await prisma.subscription.findMany({ where: { confirmed: true } });
  }

  async updateLastSentAt(id: number, date: Date): Promise<void> {
    await prisma.subscription.update({ where: { id }, data: { lastSentAt: date } });
  }

  async disconnect() {
    await prisma.$disconnect();
  }
}