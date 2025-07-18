import { IWeatherApiClient } from "../../interfaces/weather-api-client.interface";
import { Weather } from "../../models/types";

export class LoggingWeatherHandlerDecorator implements IWeatherApiClient {
    constructor(
      private readonly wrapped: IWeatherApiClient,
      private readonly providerName: string,
      private readonly logger: (msg: string) => void = console.log
    ) {}
  
    setNext(next: IWeatherApiClient): void {
      this.wrapped.setNext(next);
    }
  
    async fetchWeather(city: string): Promise<Weather | null> {
      this.logger(`Calling provider: ${this.providerName} for city: ${city}`);
      return this.wrapped.fetchWeather(city);
    }
  }