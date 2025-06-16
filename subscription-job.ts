import { AxiosHttpClient } from "../weather-api/src/infrastructure/common/axios-http-client";
import { WeatherApiUrlBuilder } from "../weather-api/src/infrastructure/helper/weather-api-url-builder";
import { WeatherApiClient } from "../weather-api/src/infrastructure/weather-api-client";
import { WeatherService } from "../weather-api/src/services/weather-service";
import { PrismaSubscriptionRepository } from "../weather-api/src/infrastructure/prisma-subscription-repository";
import { EmailService } from "../weather-api/src/services/email-service";
import { SubscriptionProcessor } from "../weather-api/src/services/subscription-processor";

const apiKey = process.env.WEATHER_API_KEY!;
const urlBuilder = new WeatherApiUrlBuilder(apiKey);
const httpClient = new AxiosHttpClient();
const weatherClient = new WeatherApiClient(urlBuilder, httpClient);
const subscriptionRepo = new PrismaSubscriptionRepository();
const emailService = new EmailService();
const weatherService = new WeatherService(weatherClient, new PrismaSubscriptionRepository(), emailService);

const processor = new SubscriptionProcessor(weatherService, subscriptionRepo, emailService);

await (async () => {
  try {
    await processor.processAll();
  } catch (err) {
    console.error(err);
  } finally {
    await subscriptionRepo.disconnect();
  }
})();