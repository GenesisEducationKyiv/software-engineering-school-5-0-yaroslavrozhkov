import express from "express";
import { WeatherApiClient } from "../infrastructure/weather-provider/weather-api-client";
import { PrismaSubscriptionRepository } from "../infrastructure/prisma-subscription-repository";
import { WeatherService } from "../services/weather-service";
import { WeatherController } from "../controllers/weather-controller";
import { WeatherApiUrlBuilder } from "../infrastructure/helper/weather-api-url-builder";
import { AxiosHttpClient } from "../infrastructure/common/axios-http-client";
import { EmailService } from "../services/email-service";
import { OpenWeatherClient } from "../infrastructure/weather-provider/open-weather-client";
import { OpenWeatherApiUrlBuilder } from "../infrastructure/helper/open-weather-api-url-builder";
import { LoggingWeatherHandlerDecorator } from "../infrastructure/logging/logging-provider";
import { fileLogger } from '../infrastructure/logging/file-logger';

const router = express.Router();

const weatherApiKey = process.env.WEATHER_API_KEY!;
const openWeatherKey = process.env.OPENWEATHER_API_KEY!;
const httpClient = new AxiosHttpClient();

const weatherApiHandler = new WeatherApiClient(
    new WeatherApiUrlBuilder(weatherApiKey),
    httpClient
  );

const openWeatherHandler = new OpenWeatherClient(
    new OpenWeatherApiUrlBuilder(openWeatherKey),
    httpClient
  );

const loggedWeatherApiHandler = new LoggingWeatherHandlerDecorator(weatherApiHandler, 'WeatherAPI', fileLogger);
const loggedOpenWeatherHandler = new LoggingWeatherHandlerDecorator(openWeatherHandler, 'OpenWeather', fileLogger);
  
loggedWeatherApiHandler.setNext(loggedOpenWeatherHandler);

const emailService = new EmailService();

const subscriptionRepo = new PrismaSubscriptionRepository();
const service = new WeatherService(loggedWeatherApiHandler, subscriptionRepo, emailService);
const controller = new WeatherController(service);

router.get("/weather", controller.getWeather);
router.post("/subscribe", controller.subscribe);
router.get("/confirm/:token", controller.confirmSubscription);
router.get("/unsubscribe/:token", controller.unsubscribe);

export default router;