import axios from "axios";
import { IEmailService } from "../../interfaces/email-service.interface";

export class HttpEmailService implements IEmailService {
  constructor(private readonly baseUrl: string) {}

  async send(to: string, subject: string, html: string): Promise<void> {
    await axios.post(`${this.baseUrl}/email/send`, {
      to,
      subject,
      html,
    });
  }
}
