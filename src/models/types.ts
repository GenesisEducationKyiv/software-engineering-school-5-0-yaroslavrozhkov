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

  export interface WeatherApiResponse {
    current: {
      temp_c: number;
      humidity: number;
      condition: {
        text: string;
      };
    };
  }

  export interface OpenWeatherApiResponse {
    main: {
      temp: number;
      humidity: number;
    };
    weather: Array<{
      description: string;
    }>;
  }

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