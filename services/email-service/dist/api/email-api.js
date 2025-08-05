"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const email_service_1 = require("../services/email-service");
const email_controller_1 = require("../controllers/email-controller");
const router = express_1.default.Router();
const emailService = new email_service_1.EmailService();
const emailController = new email_controller_1.EmailController(emailService);
router.post("/email/send", emailController.send);
exports.default = router;
