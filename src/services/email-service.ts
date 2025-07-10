import { sendEmail } from "../utils/email-service-util"; 
import { IEmailService } from "../interfaces/email-service.interface";

export class EmailService implements IEmailService {
  async send(to: string, subject: string, html: string): Promise<void> {
    await sendEmail(to, subject, html);
  }
}