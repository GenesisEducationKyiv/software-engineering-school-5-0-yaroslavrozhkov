import express from "express";
import router from "./api/weather-api";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use("/", express.static(path.resolve(__dirname, "..", "public")));


const PORT = process.env.APP_PORT || 3002;

app.listen(PORT, () => {
    console.log(`Weather service running on port ${PORT}`);
  });