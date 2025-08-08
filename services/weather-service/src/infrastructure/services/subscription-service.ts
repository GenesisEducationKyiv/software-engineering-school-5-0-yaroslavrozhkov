import { ISubscriptionService } from "../../interfaces/subscription-service.interface";
import { StoredSubscription, Subscription } from "../../models/types";
import axios from "axios";

export class HttpSubscriptionService implements ISubscriptionService {
  constructor(private readonly baseUrl: string) {}

  async findByEmailAndCity(email: string, city: string): Promise<Subscription | null> {
    const res = await axios.get(`${this.baseUrl}/subscription`, {
      params: { email, city },
    });
    return res.data as Subscription ?? null;
  }

  async create(email: string, city: string, frequency: number, token: string): Promise<void> {
    await axios.post(`${this.baseUrl}/subscription`, {
      email,
      city,
      frequency,
      token,
    });
  }

  async findByToken(token: string): Promise<Subscription | null> {
    const res = await axios.get(`${this.baseUrl}/subscription/token/${token}`);
    return res.data as Subscription ?? null;
  }

  async confirm(token: string): Promise<void> {
    await axios.post(`${this.baseUrl}/subscription/confirm/${token}`);
  }

  async deleteByToken(token: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/subscription/${token}`);
  }

  async getConfirmed(): Promise<StoredSubscription[]> {
    const res = await axios.get(`${this.baseUrl}/subscription/confirmed`);
    return res.data as StoredSubscription[] ?? [];
  }

  async updateLastSentAt(id: number, date: Date): Promise<void> {
    await axios.patch(`${this.baseUrl}/subscription/update-last-sent-at`, {
      id,
      date,
    });
  }
}
