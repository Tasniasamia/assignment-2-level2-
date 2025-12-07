import type { Request, Response } from "express"
import express, { json, Router, urlencoded } from 'express';
import initDB from "./config/db";
import route from "./routes";
import { globalErrorHandler } from "./utils/globalError";
import autoReturn from "./utils/autoRun";
const app = express()

app.use(json());
app.use(urlencoded());
app.use('/api/v1',route);


initDB();
app.get("/cron/auto-return", async (req, res) => {
  try {
    await autoReturn();
    res.send("Auto return job executed");
  } catch (e) {
    res.status(500).send("Error running job");
  }
});

app.use('/', (req:Request, res:Response) => {
  res.status(404).json({
    success:false,
    message:"Not Found Route",
    path:req.path
  })
})
app.use(globalErrorHandler);

export default app;