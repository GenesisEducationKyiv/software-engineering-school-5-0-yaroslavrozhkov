import { StoredSubscription, Subscription } from "../models/types";

export interface ISubscriptionService {
  findByEmailAndCity(email: string, city: string): Promise<Subscription | null>;
  create(email: string, city: string, frequency: number, token: string): Promise<void>;
  findByToken(token: string): Promise<Subscription | null>;
  confirm(token: string): Promise<void>;
  deleteByToken(token: string): Promise<void>;

  getConfirmed(): Promise<StoredSubscription[]>;
  updateLastSentAt(id: number, date: Date): Promise<void>;
}