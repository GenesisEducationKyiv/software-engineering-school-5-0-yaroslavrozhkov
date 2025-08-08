import express from "express";
import { EmailService } from "../services/email-service";
import { EmailController } from "../controllers/email-controller";

const router = express.Router();

const emailService = new EmailService();
const emailController = new EmailController(emailService);

router.post("/email/send", emailController.send);

export default router;
