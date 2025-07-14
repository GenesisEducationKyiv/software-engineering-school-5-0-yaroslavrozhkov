import request from "supertest";
import express from "express";
import { WeatherService } from "../../../src/services/weather-service";
import { WeatherController } from "../../../src/controllers/weather-controller";
import { IWeatherApiClient } from "../../../src/interfaces/weather-api-client.interface";
import { ISubscriptionRepository } from "../../../src/interfaces/subscription-repository.interface";
import { IEmailService } from "../../../src/interfaces/email-service.interface";

describe("GET /api/weather", () => {
  let app: express.Application;

  let mockSubscriptionRepo: ISubscriptionRepository;

  beforeAll(() => {
    const mockWeatherApiClient: IWeatherApiClient = {
        fetchWeather: () => Promise.resolve({
          temperature: 25,
          humidity: 60,
          description: "Sunny",
        }),
      };

    mockSubscriptionRepo = {
      findByEmailAndCity: jest.fn(),
      create: jest.fn(),
      findByToken: jest.fn(),
      confirm: jest.fn(),
      deleteByToken: jest.fn(),
      getConfirmed: jest.fn(),
      updateLastSentAt: jest.fn(),
    };

    const mockEmailService: IEmailService = {
      send: jest.fn(),
    };

    const service = new WeatherService(mockWeatherApiClient, mockSubscriptionRepo, mockEmailService);
    const controller = new WeatherController(service);

    app = express();
    app.use(express.json());
    app.get("/api/weather", controller.getWeather);
  });

  it("should return weather data for a valid city", async () => {
    const response = await request(app).get("/api/weather").query({ city: "Kyiv" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
        temperature: 25,
        description: "Sunny",
        humidity: 60,
    });
  });

  it("should return 400 when city is not provided", async () => {
    const response = await request(app).get("/api/weather");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
        error: "Invalid city",
    });
  });
});