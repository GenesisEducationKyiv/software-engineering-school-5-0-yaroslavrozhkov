import { RequestHandler } from "express";
import { ISubscriptionRepository } from "../interfaces/subscription-repository.interface";
import { z } from "zod";
import { StoredSubscription } from "../models/types";

export class SubscriptionController {
  constructor(private readonly subscriptionRepo: ISubscriptionRepository) {}

  create: RequestHandler = async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        city: z.string().min(1),
        frequency: z.number().int().min(1),
        token: z.string().min(1),
      });

      const { email, city, frequency, token } = schema.parse(req.body);

      await this.subscriptionRepo.create(email, city, frequency, token);
      res.status(201).json({ message: "Subscription created" });
    } catch (error) {
      const message = error instanceof z.ZodError ? "Invalid input" : (error as Error).message;
      res.status(400).json({ error: message });
    }
  };

  findByEmailAndCity: RequestHandler = async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        city: z.string().min(1),
      });

      const { email, city } = schema.parse(req.query);
      const result = await this.subscriptionRepo.findByEmailAndCity(email, city);

      if (!result) {
        res.status(404).json({ error: "Subscription not found" });
        return;
      }

      res.json(result);
    } catch (error) {
      const message = error instanceof z.ZodError ? "Invalid query parameters" : (error as Error).message;
      res.status(400).json({ error: message });
    }
  };

  findByToken: RequestHandler = async (req, res) => {
    try {
      const token = z.string().min(1).parse(req.params.token);
      const result = await this.subscriptionRepo.findByToken(token);

      if (!result) {
        res.status(404).json({ error: "Subscription not found" });
        return;
      }

      res.json(result);
    } catch {
      res.status(400).json({ error: "Invalid token" });
    }
  };

  confirm: RequestHandler = async (req, res) => {
    try {
      const token = z.string().min(1).parse(req.params.token);
      await this.subscriptionRepo.confirm(token);
      res.json({ message: "Subscription confirmed" });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  deleteByToken: RequestHandler = async (req, res) => {
    try {
      const token = z.string().min(1).parse(req.params.token);
      await this.subscriptionRepo.deleteByToken(token);
      res.json({ message: "Subscription deleted" });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  getConfirmed: RequestHandler = async (_req, res) => {
    try {
      const subscriptions: StoredSubscription[] = await this.subscriptionRepo.getConfirmed();
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  updateLastSentAt: RequestHandler = async (req, res) => {
    try {
      const schema = z.object({
        id: z.number().int(),
        date: z.coerce.date(),
      });

      const { id, date } = schema.parse(req.body);
      await this.subscriptionRepo.updateLastSentAt(id, date);
      res.json({ message: "Last sent date updated" });
    } catch (error) {
      const message = error instanceof z.ZodError ? "Invalid input" : (error as Error).message;
      res.status(400).json({ error: message });
    }
  };
}
