export class OpenWeatherApiUrlBuilder {
    private readonly baseUrl = "https://api.openweathermap.org/data/2.5/weather";
    private readonly apiKey: string;
  
    constructor(apiKey: string) {
      this.apiKey = apiKey;
    }
  
    build(city: string): string {
      const url = new URL(this.baseUrl);
      url.search = new URLSearchParams({
        q: city,
        appid: this.apiKey,
        units: "metric"
      }).toString();
  
      return url.toString();
    }
  }