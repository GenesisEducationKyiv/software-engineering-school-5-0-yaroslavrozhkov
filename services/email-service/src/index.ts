import express from "express";
import router from "./api/email-api";
import { logger } from '@genesishomework/shared-utils/src';

const app = express();
app.use(express.json());

const PORT = process.env.APP_PORT || 3001;

app.use("/api", router);

app.listen(PORT, () => {
  logger.info(`Email service running on port ${PORT}`);
});
