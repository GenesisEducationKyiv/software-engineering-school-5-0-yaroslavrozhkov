"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "SendGrid",
    auth: {
        user: "apikey",
        pass: process.env.EMAIL_API_KEY,
    },
});
async function sendEmail(to, subject, html) {
    const emailSender = process.env.EMAIL_SENDER;
    try {
        const info = await transporter.sendMail({
            from: `"Weather Forecast" <${emailSender}>`,
            to,
            subject,
            html,
        });
        console.log(`Email sent to ${to}. Message ID: ${info.messageId}`);
    }
    catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
        throw new Error("Email sending failed");
    }
}
