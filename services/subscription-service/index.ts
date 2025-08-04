import express from "express";
import router from "./src/api/subscription-api";

const app = express();
app.use(express.json());


const PORT = process.env.APP_PORT || 3001;

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Email service running on port ${PORT}`);
});