export class WeatherNotFoundError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'WeatherNotFoundError';
    }
  }