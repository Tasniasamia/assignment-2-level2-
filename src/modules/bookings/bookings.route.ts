import { Router } from "express";
import { isVerify } from "../../middleware/isVerify";
import { bookingController } from "./bookings.controller";

const bookingRoute=Router();
bookingRoute.post('/',isVerify('admin','customer'),bookingController.createBooking);
bookingRoute.get('/',isVerify('admin','customer'),bookingController.getBooking);
bookingRoute.put('/:bookingId',isVerify('admin','customer'),bookingController.updateBooking)

export default bookingRoute;