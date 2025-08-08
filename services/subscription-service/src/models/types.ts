export interface StoredSubscription {
    id: number;
    email: string;
    city: string;
    frequency: number;
    confirmed: boolean;
    token: string;
    createdAt: Date;
    lastSentAt: Date | null;
  }