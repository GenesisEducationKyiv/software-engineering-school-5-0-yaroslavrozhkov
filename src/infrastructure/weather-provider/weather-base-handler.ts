import { IWeatherApiClient } from "../../interfaces/weather-api-client.interface";
import { Weather } from "../../models/types";

export abstract class WeatherProviderHandlerBase implements IWeatherApiClient {
    private next: IWeatherApiClient | null = null;
  
    public setNext(next: IWeatherApiClient): void {
      this.next = next;
    }
  
    public async fetchWeather(city: string): Promise<Weather | null> {
      const result = await this.tryGetWeather(city);
  
      if (result !== null) {
        return result;
      }
  
      if (this.next) {
        return this.next.fetchWeather(city);
      }
  
      return null;
    }
  
    protected abstract tryGetWeather(city: string): Promise<Weather | null>;
  }