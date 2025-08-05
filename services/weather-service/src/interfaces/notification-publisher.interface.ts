export interface INotificationPublisher {
    publishWeatherAlert(email: string, subject: string, message: string): Promise<void>;
  }