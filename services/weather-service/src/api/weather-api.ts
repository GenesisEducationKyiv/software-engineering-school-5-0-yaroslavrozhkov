import { HttpSubscriptionService } from "../infrastructure/services/subscription-service";
import { WeatherService } from "../services/weather-service";
import { HttpEmailService } from "../infrastructure/services/email-service";
import { RedisCacheWeatherClient } from "../infrastructure/helper/redis-cache-weather-client";
import { AxiosHttpClient } from "../infrastructure/common/axios-http-client";
import { WeatherApiClient } from "../infrastructure/weather-provider/weather-api-client";
import { WeatherApiUrlBuilder } from "../infrastructure/helper/weather-api-url-builder";
import { OpenWeatherApiUrlBuilder } from "../infrastructure/helper/open-weather-api-url-builder";
import { OpenWeatherClient } from "../infrastructure/weather-provider/open-weather-client";
import { LoggingWeatherHandlerDecorator } from "../infrastructure/logging/logging-provider";
import { fileLogger } from '../infrastructure/logging/file-logger';
import { WeatherController } from "../controllers/weaher-controllers";
import express from "express";

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

const subscriptionService = new HttpSubscriptionService("http://localhost:3003/api");
const emailService = new HttpEmailService("http://localhost:3001/api");
const cachedClient = new RedisCacheWeatherClient(loggedWeatherApiHandler);

const service = new WeatherService(cachedClient, subscriptionService, emailService);
const router = express.Router();
const controller = new WeatherController(service);

  router.get("/weather", controller.getWeather);
  router.post("/subscribe", controller.subscribe);
  router.get("/confirm/:token", controller.confirmSubscription);
  router.get("/unsubscribe/:token", controller.unsubscribe);
  
  export default router;