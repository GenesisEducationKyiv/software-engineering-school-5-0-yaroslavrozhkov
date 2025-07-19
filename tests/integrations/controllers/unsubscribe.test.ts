/* eslint-disable @typescript-eslint/unbound-method */
import request from "supertest";
import express from "express";
import { WeatherService } from "../../../src/services/weather-service";
import { WeatherController } from "../../../src/controllers/weather-controller";
import { IWeatherApiClient } from "../../../src/interfaces/weather-api-client.interface";
import { ISubscriptionRepository } from "../../../src/interfaces/subscription-repository.interface";
import { IEmailService } from "../../../src/interfaces/email-service.interface";

describe("DELETE /api/unsubscribe/:token", () => {
  let app: express.Application;
  let mockSubscriptionRepo!: jest.Mocked<ISubscriptionRepository>;
  let mockWeatherApiClient!: jest.Mocked<IWeatherApiClient>;
  let mockEmailService!: jest.Mocked<IEmailService>;

  beforeAll(() => {
    mockWeatherApiClient = {
      fetchWeather: jest.fn(),
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
    jest.spyOn(service, "unsubscribe").mockImplementation(async (token: string) => {
        await mockSubscriptionRepo.deleteByToken(token);
      });
    const controller = new WeatherController(service);

    app = express();
    app.use(express.json());
    app.delete("/api/unsubscribe/:token", controller.unsubscribe);
  });

  it("should return success message when unsubscription is successful", async () => {
    (mockSubscriptionRepo.deleteByToken as jest.Mock).mockResolvedValueOnce(true);
    jest.spyOn(WeatherService.prototype, 'unsubscribe').mockResolvedValueOnce();

    const response = await request(app).delete("/api/unsubscribe/valid-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Unsubscribed successfully",
    });
    expect(mockSubscriptionRepo.deleteByToken).toHaveBeenCalledWith("valid-token");
  });

  it("should return 400 when token is invalid or not found", async () => {
    (mockSubscriptionRepo.deleteByToken as jest.Mock).mockRejectedValueOnce(new Error("Token not found"));

    const response = await request(app).delete("/api/unsubscribe/invalid-token");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
        error: "Token not found",
    });
  });
});
