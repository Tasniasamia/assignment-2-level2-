import type { Request, Response } from "express";
import express, { json, urlencoded } from "express";
import initDB from "./config/db";
import route from "./routes";
import { globalErrorHandler } from "./utils/globalError";
import autoReturn from "./utils/autoRun";

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

initDB();

app.use("/api/v1", route);

app.get("/cron/auto-return", async (req: Request, res: Response) => {
  try {
    await autoReturn();
    res.status(200).send("Auto return job executed");
  } catch (e: any) {
    console.error("AUTO RETURN ERROR:", e);
    res.status(500).send(e.message || "Error running job");
  }
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Not Found Route",
    path: req.path,
  });
});

app.use(globalErrorHandler);

export default app;
