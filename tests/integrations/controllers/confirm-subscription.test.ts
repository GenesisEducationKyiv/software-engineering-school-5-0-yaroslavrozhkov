/* eslint-disable @typescript-eslint/unbound-method */
import request from "supertest";
import express from "express";
import { WeatherService } from "../../../src/services/weather-service";
import { WeatherController } from "../../../src/controllers/weather-controller";
import { IWeatherApiClient } from "../../../src/interfaces/weather-api-client.interface";
import { ISubscriptionRepository } from "../../../src/interfaces/subscription-repository.interface";
import { IEmailService } from "../../../src/interfaces/email-service.interface";

describe("GET /api/confirm/:token", () => {
  let app: express.Application;
  let mockSubscriptionRepo!: jest.Mocked<ISubscriptionRepository>;
  let mockWeatherApiClient!: jest.Mocked<IWeatherApiClient>;
  let mockEmailService!: jest.Mocked<IEmailService>;

  beforeAll(() => {
    mockWeatherApiClient = {
      fetchWeather: jest.fn().mockResolvedValue({
        temperature: 25,
        humidity: 60,
        description: "Sunny",
      }),
      setNext: jest.fn(),
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

    mockEmailService = {
      send: jest.fn(),
    };

    const service = new WeatherService(mockWeatherApiClient, mockSubscriptionRepo, mockEmailService);
    const controller = new WeatherController(service);

    app = express();
    app.use(express.json());
    app.get("/api/confirm/:token", controller.confirmSubscription);
  });

  it("should return success message when confirmation is successful", async () => {
    const token = "valid-token";
    (mockSubscriptionRepo.findByToken as jest.Mock).mockResolvedValue({ id: 1, email: "test@example.com" });
    (mockSubscriptionRepo.confirm as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app).get(`/api/confirm/${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Subscription confirmed successfully",
    });
    expect(mockSubscriptionRepo.confirm).toHaveBeenCalledWith(token);
  });

  it("should return 400 with error message when token is invalid", async () => {
    const token = "invalid-token";
    (mockSubscriptionRepo.confirm as jest.Mock).mockRejectedValue(new Error("Token not found"));

    const response = await request(app).get(`/api/confirm/${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
        error: "Token not found",
    });
    expect(mockSubscriptionRepo.confirm).toHaveBeenCalledWith(token);
  });
});