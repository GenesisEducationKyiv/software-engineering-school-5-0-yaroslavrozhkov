import { IWeatherService } from "../interfaces/weather-service.interface";
import { ISubscriptionRepository } from "../interfaces/subscription-repository.interface";
import { IEmailService } from "../interfaces/email-service.interface";
import { StoredSubscription } from "../models/types";

export class SubscriptionProcessor {
  constructor(
    private readonly weatherService: IWeatherService,
    private readonly subscriptionRepo: ISubscriptionRepository,
    private readonly emailService: IEmailService
  ) {}

  async processAll(): Promise<void> {
    const now = new Date();
    const subscriptions = await this.subscriptionRepo.getConfirmed();

    for (const sub of subscriptions) {
      if (!this.shouldSend(sub, now)) continue;

      const weather = await this.weatherService.getWeather(sub.city);

      await this.emailService.send(
        sub.email,
        `Weather update for ${sub.city}`,
        `
          <p><b>City:</b> ${sub.city}</p>
          <p><b>Temperature:</b> ${weather.temperature}°C</p>
          <p><b>Humidity:</b> ${weather.humidity}%</p>
          <p><b>Description:</b> ${weather.description}</p>
        `
      );

      await this.subscriptionRepo.updateLastSentAt(sub.id, now);
      console.log(`Email sent to ${sub.email} for ${sub.city}`);
    }
  }

  private shouldSend(sub: StoredSubscription, now: Date): boolean {
    if (!sub.lastSentAt) return true;
    const diff = now.getTime() - sub.lastSentAt.getTime();
    return sub.frequency === 1
      ? diff > 60 * 60 * 1000
      : diff > 24 * 60 * 60 * 1000;
  }
}