import { Weather, WeatherApiResponse } from "../../models/types";
import { IHttpClient } from "../../interfaces/http-client.interface";
import { WeatherApiUrlBuilder } from "../helper/weather-api-url-builder";
import { WeatherProviderHandlerBase } from "./weather-base-handler";

export class WeatherApiClient extends WeatherProviderHandlerBase {
  constructor(
    private readonly urlBuilder: WeatherApiUrlBuilder,
    private readonly httpClient: IHttpClient
  ) {
    super();
  }

  protected async tryGetWeather(city: string): Promise<Weather | null> {
    try {
      const url = this.urlBuilder.build(city);
      const response = await this.httpClient.get<WeatherApiResponse>(url);
      return this.mapToWeatherData(response.data);
    } catch {
      return null;
    }
  }

  private mapToWeatherData(data: WeatherApiResponse): Weather {
    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };
  }
}