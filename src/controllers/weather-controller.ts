import { Request, Response } from "express";
import { IWeatherService } from "../interfaces/weather-service.interface";
import { SubscribeResponse, SubscribeRequestBody} from "../models/types";

export class WeatherController {
  constructor(private weatherService: IWeatherService) {}

  getWeather = async (req: Request, res: Response) => {
    try {
      const { city } = req.query;

      if (typeof city !== "string") {
        return res.status(400).json({ error: "City must be a string" });
      }
      
      const weather = await this.weatherService.getWeather(city);
      res.json(weather);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(400).json({ error: message });
    }
  };

  subscribe = async (
    req: Request<Record<string, never>, SubscribeResponse, SubscribeRequestBody>,
    res: Response
  ) => {
    try {
      const { email, city, frequency } = req.body;
      await this.weatherService.subscribe(email, city, frequency);
      res.json({ message: "Subscription successful. Confirmation email sent." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      const status = message === "Email already subscribed" ? 409 : 400;
      res.status(status).json({ error: message });
    }
  };

  confirmSubscription = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      await this.weatherService.confirmSubscription(token);
      res.json({ message: "Subscription confirmed successfully" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(400).json({ error: message });
    }
  };

  unsubscribe = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      await this.weatherService.unsubscribe(token);
      res.json({ message: "Unsubscribed successfully" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(400).json({ error: message });
    }
  };
}