import { IWeatherApiClient } from "../interfaces/weather-api-client.interface";
import { Weather, WeatherApiResponse } from "../models/types";
import { IHttpClient } from "../interfaces/http-client.interface";
import { WeatherApiUrlBuilder } from "./helper/weather-api-url-builder";

export class WeatherApiClient implements IWeatherApiClient {
  constructor(
    private readonly urlBuilder: WeatherApiUrlBuilder,
    private readonly httpClient: IHttpClient
  ) {}

  async fetchWeather(city: string): Promise<Weather> {
    const url = this.urlBuilder.build(city);
    const response = await this.httpClient.get<WeatherApiResponse>(url);
    return this.mapToDomain(response.data);
  }

  private mapToDomain(data: WeatherApiResponse): Weather {
    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };
  }
}