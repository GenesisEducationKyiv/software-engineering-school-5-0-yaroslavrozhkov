import express from "express";
import router from "./api/subscription-api";

const app = express();
app.use(express.json());


const PORT = process.env.APP_PORT || 3003;

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Subscription service running on port ${PORT}`);
});