import express from "express";
import router from "./api/weather-api";
import path from "path";
import { getMetrics } from "@genesishomework/shared-utils/src";
import { logger } from '@genesishomework/shared-utils/src';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use("/", express.static(path.resolve(__dirname, "..", "public")));


const PORT = process.env.APP_PORT || 3002;

app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(await getMetrics());
  });

app.listen(PORT, () => {
    logger.info(`Weather service running on port ${PORT}`);
  });