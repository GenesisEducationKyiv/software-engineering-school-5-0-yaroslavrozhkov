import express from "express";
import { WeatherApiClient } from "../infrastructure/weather-api-client";
import { PrismaSubscriptionRepository } from "../infrastructure/prisma-subscription-repository";
import { WeatherService } from "../services/weather-service";
import { WeatherController } from "../controllers/weather-controller";
import { WeatherApiUrlBuilder } from "../infrastructure/helper/weather-api-url-builder";
import { AxiosHttpClient } from "../infrastructure/common/axios-http-client";
import { EmailService } from "../services/email-service";

const router = express.Router();

const apiKey = process.env.WEATHER_API_KEY!;
const urlBuilder = new WeatherApiUrlBuilder(apiKey);
const httpClient = new AxiosHttpClient();
const weatherClient = new WeatherApiClient(urlBuilder, httpClient);
const emailService = new EmailService();

const subscriptionRepo = new PrismaSubscriptionRepository();
const service = new WeatherService(weatherClient, subscriptionRepo, emailService);
const controller = new WeatherController(service);

router.get("/weather", controller.getWeather);
router.post("/subscribe", controller.subscribe);
router.get("/confirm/:token", controller.confirmSubscription);
router.get("/unsubscribe/:token", controller.unsubscribe);

export default router;