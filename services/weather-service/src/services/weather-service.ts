import { IWeatherService } from "../interfaces/weather-service.interface";
import { IWeatherApiClient } from "../interfaces/weather-api-client.interface";
import { ISubscriptionService } from "../interfaces/subscription-service.interface";
import { INotificationPublisher } from "../interfaces/notification-publisher.interface";
import { Weather } from "../models/types";

import { v4 as uuidv4 } from "uuid";
import { WeatherNotFoundError } from "../domain/errors";

export class WeatherService implements IWeatherService {
  constructor(
    private weatherApiClient: IWeatherApiClient,
    private subscriptionService: ISubscriptionService,
    private notificationPublisher: INotificationPublisher
  ) {}

  async getWeather(city: string): Promise<Weather> {
    if (!city) throw new Error("City is required");

    const result = await this.weatherApiClient.fetchWeather(city);

    if (!result) {
      throw new WeatherNotFoundError(`Weather data not found for city: ${city}`);
    }

    return result;
  }

  async subscribe(email: string, city: string, frequency: string): Promise<void> {
    const existing = await this.subscriptionService.findByEmailAndCity(email, city);
    if (existing) throw new Error("Email already subscribed");

    let frequencyValue: number;
    if (frequency.toLowerCase() === "hourly") {
      frequencyValue = 1;
    } else if (frequency.toLowerCase() === "daily") {
      frequencyValue = 2;
    } else {
      throw new Error("Invalid frequency. Must be 'hourly' or 'daily'");
    }

    try {
      await this.getWeather(city);
    } catch {
      throw new Error(`Invalid city: "${city}". Weather data could not be retrieved.`);
    }

    const token = uuidv4();
    await this.subscriptionService.create(email, city, frequencyValue, token);

    await this.notificationPublisher.publishWeatherAlert(
      email,
      "Weather Update : Confirmation token",
      `<p>Use this token to confirm your subscription: <strong>${token}</strong></p>`
    );

    console.log(`📨 Published weather alert message with token: ${token}`);
  }

  async confirmSubscription(token: string): Promise<void> {
    const subscription = await this.subscriptionService.findByToken(token);
    if (!subscription) throw new Error("Token not found");

    await this.subscriptionService.confirm(token);
  }

  async unsubscribe(token: string): Promise<void> {
    const subscription = await this.subscriptionService.findByToken(token);
    if (!subscription) throw new Error("Token not found");

    await this.subscriptionService.deleteByToken(token);
  }
}
