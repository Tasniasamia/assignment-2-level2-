import type { Request, Response } from "express"
import { AppError } from "../../utils/error"
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";
import type { JwtPayload } from "jsonwebtoken";

const updateUser=async(req:Request,res:Response)=>{
   if(!req?.params.userId){
    throw new AppError("userId is required", 400);
   }

   const result=await userService.updateUser(req.body,req.user as JwtPayload,req.params.userId);
   if(!result){
    throw new AppError("User not found", 404);
   }
   return await sendResponse(res, {
    success: true,
    statusCode: 200,
    message:"User updated successfully",
    data:result
  });
}

 const getUsers=async(req:Request,res:Response)=>{
    const result=await userService.getUsers();
    return await sendResponse(res, {
        success: true,
        statusCode: 200,
        message:"Users retrieved successfully",
        data: result,
      });
}

const deleteUser=async(req:Request,res:Response)=>{
    if(!req?.params?.userId){
        throw new AppError("userId is required", 400);
    }
    const result=await userService.deleteUser(req.params.userId);
    if(!result){
        throw new AppError("User not found", 404);
    }
    return await sendResponse(res, {
        success: true,
        statusCode: 200,
        message:"User deleted successfully",
      });
}

export const userController={
updateUser,getUsers,deleteUser
}