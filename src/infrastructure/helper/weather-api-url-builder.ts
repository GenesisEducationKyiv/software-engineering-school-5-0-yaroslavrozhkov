export class WeatherApiUrlBuilder {
    private readonly baseUrl = "http://api.weatherapi.com/v1/forecast.json";
    private readonly apiKey: string;
  
    constructor(apiKey: string) {
      this.apiKey = apiKey;
    }
  
    build(city: string): string {
      const url = new URL(this.baseUrl);
      url.search = new URLSearchParams({
        key: this.apiKey,
        q: city,
        days: "0",
        aqi: "no",
        alerts: "no"
      }).toString();
  
      return url.toString();
    }
  }