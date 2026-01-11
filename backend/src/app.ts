import express, { Request, Response } from "express";
import cors from "cors";

import electricityRoutes from "./routes/electricityRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

app.use("/api/electricity", electricityRoutes);

export default app;
