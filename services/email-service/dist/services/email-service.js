"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const email_service_util_1 = require("../utils/email-service-util");
class EmailService {
    async send(to, subject, html) {
        await (0, email_service_util_1.sendEmail)(to, subject, html);
    }
}
exports.EmailService = EmailService;
