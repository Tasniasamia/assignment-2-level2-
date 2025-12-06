import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { AppError } from "../../utils/error";
import { sendResponse } from "../../utils/sendResponse";

const signupController = async (req: Request, res: Response) => {
  const createUser = await authService.signupService(req.body);
  if (!createUser) {
    throw new AppError("Registration failed", 401);
  }
  return await sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: createUser,
  });
};

const signinController=async(req:Request,res:Response)=>{
  const {email,password}=await req.body;
  if(!email && !password){
    throw new AppError('Login failed',400)
  }
 const loginUser=await authService.signinService(email,password);
 return await sendResponse(res, {
  statusCode: 200,
  success: true,
  message: "Login successful",
  data: loginUser,
});
}


export const authController = {
  signupController,
  signinController
};
