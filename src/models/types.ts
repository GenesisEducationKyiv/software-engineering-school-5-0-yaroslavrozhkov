export type Weather = {
    temperature: number;
    humidity: number;
    description: string;
  };
  
  export type Subscription = {
    email: string;
    city: string;
    frequency: "hourly" | "daily";
    lastSentAt: Date;
  };

  export type SubscribeRequestBody = {
    email: string;
    city: string;
    frequency: string;
  }

  export type SubscribeResponse = { 
    message: string 
  };