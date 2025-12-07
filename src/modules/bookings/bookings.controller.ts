import type { Request, Response } from "express";
import { bookingService } from "./bookings.service";
import { AppError } from "../../utils/error";
import { sendResponse } from "../../utils/sendResponse";
import type { JwtPayload } from "jsonwebtoken";

const createBooking = async (req: Request, res: Response) => {
  const result = await bookingService.createBooking(req?.body);
  if (!result) {
    throw new AppError("Failed to create booking", 401);
  }
  return await sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Booking created successfully",
    data: result,
  });
};
const getBooking = async (req: Request, res: Response) => {
  const result = await bookingService.getBooking(req);

  return await sendResponse(res, {
    success: true,
    statusCode: 201,
    message:
      req?.user?.role == "admin"
        ? "Bookings retrieved successfully"
        : "Your bookings retrieved successfully",
    data: result,
  });
};

const updateBooking=async(req:Request,res:Response)=>{
  if(!req?.params.bookingId){
   throw new AppError("bookingId is required", 400);
  }
 const result=await bookingService.updateBooking(req.body,req.user as JwtPayload,req.params.bookingId);
  if(!result[0]){
   throw new AppError("Booking not found", 404);
  }
  return await sendResponse(res, {
   success: true,
   statusCode: 200,
   message:result[1]==="cancelled"?"Booking cancelled successfully":"Booking marked as returned. Vehicle is now available",
   data:result[0]
 });
}

export const bookingController = {
  createBooking,
  getBooking,
  updateBooking
};
