"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailController = void 0;
const zod_1 = require("zod");
class EmailController {
    constructor(emailService) {
        this.emailService = emailService;
        this.send = async (req, res) => {
            try {
                const schema = zod_1.z.object({
                    to: zod_1.z.string().email(),
                    subject: zod_1.z.string().min(1),
                    html: zod_1.z.string().min(1),
                });
                const { to, subject, html } = schema.parse(req.body);
                await this.emailService.send(to, subject, html);
                res.status(200).json({ message: "Email sent" });
            }
            catch (err) {
                const message = err instanceof zod_1.z.ZodError ? "Invalid input" : err.message;
                res.status(400).json({ error: message });
            }
        };
    }
}
exports.EmailController = EmailController;
