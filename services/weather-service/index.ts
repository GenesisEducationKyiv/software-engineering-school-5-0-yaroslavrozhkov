import express from "express";
import router from "./src/api/weather-api";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use("/", express.static(path.resolve(__dirname, "..", "public")));

export default app;