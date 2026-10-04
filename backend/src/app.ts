import express from "express";
import cors from "cors";
import { env } from "./lib/env";
import authRoutes from "./routes/auth.routes";
import requestRoutes from "./routes/request.routes";
import { errorMiddleware } from "./middlewares/error";

export const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);

app.use(errorMiddleware);
