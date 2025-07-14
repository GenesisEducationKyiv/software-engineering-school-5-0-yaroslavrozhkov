/* eslint-disable @typescript-eslint/unbound-method */
import request from "supertest";
import express from "express";
import { WeatherService } from "../../../src/services/weather-service";
import { WeatherController } from "../../../src/controllers/weather-controller";
import { IWeatherApiClient } from "../../../src/interfaces/weather-api-client.interface";
import { ISubscriptionRepository } from "../../../src/interfaces/subscription-repository.interface";
import { IEmailService } from "../../../src/interfaces/email-service.interface";


describe("POST /api/subscribe", () => {
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
        app.post("/api/subscribe", controller.subscribe);
      });
  
    it("should return success message when subscription is successful", async () => {
      const response = await request(app)
        .post("/api/subscribe")
        .send({
          email: "test@example.com",
          city: "Kyiv",
          frequency: "daily",
        });
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Subscription successful. Confirmation email sent.",
      });
      expect(mockSubscriptionRepo.create).toHaveBeenCalledWith(
        "test@example.com",
        "Kyiv",
        2,
        expect.any(String)
      );
      expect(mockEmailService.send).toHaveBeenCalled();
    });
  
    it("should return 409 when email is already subscribed", async () => {
      (mockSubscriptionRepo.findByEmailAndCity as jest.Mock).mockResolvedValueOnce(true);
  
      const response = await request(app)
        .post("/api/subscribe")
        .send({
          email: "test@example.com",
          city: "Kyiv",
          frequency: "daily",
        });
  
      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        error: "Email already subscribed",
      });
    });
  
    it("should return 400 when frequency is invalid", async () => {
      const response = await request(app)
        .post("/api/subscribe")
        .send({
          email: "test@example.com",
          city: "Kyiv",
          frequency: "weekly",
        });
  
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Invalid frequency. Must be 'hourly' or 'daily'",
      });
    });
  
    it("should return 400 when city is invalid", async () => {
      (mockWeatherApiClient.fetchWeather as jest.Mock).mockRejectedValueOnce(new Error("City not found"));
  
      const response = await request(app)
        .post("/api/subscribe")
        .send({
          email: "test@example.com",
          city: "InvalidCity",
          frequency: "daily",
        });
  
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Invalid city: "InvalidCity". Weather data could not be retrieved.',
      });
    });
  });
  