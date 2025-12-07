import type { Request, Response } from "express";
import { bookingService } from "./bookings.service";
import { AppError } from "../../utils/error";
import { sendResponse } from "../../utils/sendResponse";

const createBooking=async(req:Request,res:Response)=>{
   const result=await bookingService.createBooking(req?.body);
   if (!result) {
    throw new AppError("Failed to create booking", 401);
  }
  return await sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Booking created successfully",
    data: result,
  });
}

export const bookingController={
    createBooking
}