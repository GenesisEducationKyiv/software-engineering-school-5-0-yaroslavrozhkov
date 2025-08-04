import express from "express";
import emailApi from "./src/api/email-api";

const app = express();
app.use(express.json());

const PORT = process.env.APP_PORT || 3002;

app.use("/api", emailApi);

app.listen(PORT, () => {
  console.log(`Email service running on port ${PORT}`);
});
