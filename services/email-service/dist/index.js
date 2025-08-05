"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const email_api_1 = __importDefault(require("../src/api/email-api"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = process.env.APP_PORT || 3002;
app.use("/api", email_api_1.default);
app.listen(PORT, () => {
    console.log(`Email service running on port ${PORT}`);
});
