import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils";
import type { JwtPayload } from "jsonwebtoken";
import { AppError } from "../utils/error";
import { sendResponse } from "../utils/sendResponse";

export const isVerify =  (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("roles", roles);
    const token = req.headers.authorization?.split(" ")[1];
    const user = (await verifyToken(token as string)) as JwtPayload;
    if (!roles.includes(user?.role)) {
      return await sendResponse(res, {
        success: false,
        message: "Forbidden user",
        statusCode: 403,
      });
    }
    req.user =  user;

    return  next();
  }
}
