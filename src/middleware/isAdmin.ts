import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils";
import type { JwtPayload } from "jsonwebtoken";
import { AppError } from "../utils/error";
import { sendResponse } from "../utils/sendResponse";

export const isAdmin=async(req:Request,res:Response,next:NextFunction)=>{
    const token=req.headers.authorization?.split(" ")[1];
    const user=await verifyToken(token as string) as JwtPayload;
    if(user?.role != 'admin'){
        return sendResponse(res,{success:false,message:"Forbidden user",statusCode:403})
    }
     
    return next();
}