import { Router } from "express";
import { isVerify } from "../../middleware/isVerify";
import { bookingController } from "./bookings.controller";

const bookingRoute=Router();
bookingRoute.post('/',isVerify('admin','user'),bookingController.createBooking);


export default bookingRoute;