import { IWeatherApiClient } from "../../interfaces/weather-api-client.interface";
import { Weather } from "../../models/types";
import { getRedisClient } from "../redis/redis-client";

const CACHE_TTL = 60 * 10;

export class RedisCacheWeatherClient implements IWeatherApiClient {
  private nextClient: IWeatherApiClient | null = null;

  constructor(private inner: IWeatherApiClient) {}

  setNext(next: IWeatherApiClient): void {
    this.nextClient = next;
  }

  async fetchWeather(city: string): Promise<Weather | null> {
    const cacheKey = `weather:${city.toLowerCase()}`;
    const redis = await getRedisClient();
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached) as Weather;
    }

    const result = await this.inner.fetchWeather(city);

    if (result) {
      await redis.set(cacheKey, JSON.stringify(result), {
        EX: CACHE_TTL,
      });
    }

    return result;
  }
}
