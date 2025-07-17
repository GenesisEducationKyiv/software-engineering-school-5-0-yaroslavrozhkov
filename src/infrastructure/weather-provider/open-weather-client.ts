import { OpenWeatherApiResponse, Weather } from "../../models/types";
import { IHttpClient } from "../../interfaces/http-client.interface";
import { WeatherProviderHandlerBase } from "./weather-base-handler";
import { OpenWeatherApiUrlBuilder } from "../helper/open-weather-api-url-builder";

export class OpenWeatherClient extends WeatherProviderHandlerBase {
  constructor(
    private readonly urlBuilder: OpenWeatherApiUrlBuilder,
    private readonly httpClient: IHttpClient
  ) {
    super();
  }

  protected async tryGetWeather(city: string): Promise<Weather | null> {
    try {
      const url = this.urlBuilder.build(city);
      const response = await this.httpClient.get<OpenWeatherApiResponse>(url);
      return this.mapToWeatherData(response.data);
    } catch {
      return null;
    }
  }

  private mapToWeatherData(data: OpenWeatherApiResponse): Weather {
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0]?.description ?? "",
    };
  }
}