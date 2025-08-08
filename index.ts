import dotenv from "dotenv";
dotenv.config();

import app from "./src/server";

const PORT = process.env.APP_PORT || 3000;
const url = process.env.SERVICE_URL || "http://localhost";

app.listen(PORT, () => {
  console.log(`Server running at ${url}:${PORT}`);
});