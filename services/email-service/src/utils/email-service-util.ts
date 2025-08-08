import nodemailer from "nodemailer";
import { logger, sampleLog } from '@genesishomework/shared-utils/src';

const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: "apikey",
    pass: process.env.EMAIL_API_KEY!,
  },
});

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {

    const emailSender = process.env.EMAIL_SENDER;

    try {
      const info = await transporter.sendMail({
        from: `"Weather Forecast" <${emailSender}>`,
        to,
        subject,
        html,
      });
  
      if (sampleLog(0.1)) {
        logger.info(`Email sent to ${to}. Message ID: ${info.messageId}`);
      }
    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error);
      throw new Error("Email sending failed");
    }
}