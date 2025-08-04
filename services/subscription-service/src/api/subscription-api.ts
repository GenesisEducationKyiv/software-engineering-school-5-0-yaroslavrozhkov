import express from "express";
import { PrismaSubscriptionRepository } from "../infrastracture/prisma-subscription-repository";
import { SubscriptionController } from "../controllers/subscription-controllers";

const router = express.Router();

const subscriptionRepo = new PrismaSubscriptionRepository();

const subscriptionController = new SubscriptionController(subscriptionRepo);

router.post("/subscription", subscriptionController.create);
router.get("/subscription", subscriptionController.findByEmailAndCity);
router.get("/subscription/token/:token", subscriptionController.findByToken);
router.post("/subscription/confirm/:token", subscriptionController.confirm);
router.delete("/subscription/:token", subscriptionController.deleteByToken);
router.get("/subscription/confirmed", subscriptionController.getConfirmed);
router.patch("/subscription/update-last-sent-at", subscriptionController.updateLastSentAt);

export default router;
