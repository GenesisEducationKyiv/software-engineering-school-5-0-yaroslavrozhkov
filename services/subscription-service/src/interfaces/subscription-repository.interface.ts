import { StoredSubscription } from "../models/types";

export type Subscription = {
  id: number;
  email: string;
  city: string;
  frequency: number;
  token: string;
  confirmed: boolean;
  lastSentAt: Date | null;
};

export interface ISubscriptionRepository {
  findByEmailAndCity(email: string, city: string): Promise<Subscription | null>;
  create(email: string, city: string, frequency: number, token: string): Promise<void>;
  findByToken(token: string): Promise<Subscription | null>;
  confirm(token: string): Promise<void>;
  deleteByToken(token: string): Promise<void>;

  getConfirmed(): Promise<StoredSubscription[]>;
  updateLastSentAt(id: number, date: Date): Promise<void>;
}