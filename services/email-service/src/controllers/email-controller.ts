import { Request, Response } from "express";
import { IEmailService } from "../interfaces/email-service.interface";
import { z } from "zod";

export class EmailController {
  constructor(private readonly emailService: IEmailService) {}

  send = async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        to: z.string().email(),
        subject: z.string().min(1),
        html: z.string().min(1),
      });

      const { to, subject, html } = schema.parse(req.body);

      await this.emailService.send(to, subject, html);
      res.status(200).json({ message: "Email sent" });
    } catch (err) {
      const message = err instanceof z.ZodError ? "Invalid input" : (err as Error).message;
      res.status(400).json({ error: message });
    }
  };
}
