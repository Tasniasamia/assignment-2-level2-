import type { Request, Response } from "express"
import express, { json, Router, urlencoded } from 'express';
import initDB from "./config/db";
import route from "./routes";
import { globalErrorHandler } from "./utils/globalError";
const app = express()

app.use(json());
app.use(urlencoded());
app.use('/api/v1',route);

initDB();

app.use('/', (req:Request, res:Response) => {
  res.json({
    success:false,
    message:"Not Found Route",
    path:req.path
  })
})
app.use(globalErrorHandler);

export default app;