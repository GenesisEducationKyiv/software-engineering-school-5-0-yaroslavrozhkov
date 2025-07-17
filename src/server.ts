import express from "express";
import apiRoutes from "./routes/api";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRoutes);
app.use("/", express.static(path.resolve(__dirname, "..", "public")));

export default app;