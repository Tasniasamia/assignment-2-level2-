import type { Request } from "express";
import { pool } from "../../config/db";
import { AppError } from "../../utils/error";
import type { JwtPayload } from "jsonwebtoken";

const createBooking = async (payload: Record<string, unknown>) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    const findUser = await pool.query(
      "SELECT id,name,email,phone,role FROM users WHERE id=$1",
      [customer_id]
    );

    if (findUser.rows.length === 0) {
      throw new AppError("Customer not found", 404);
    }

    const findVehicle = await pool.query(
      "SELECT * FROM vehicles WHERE id=$1 AND availability_status=$2",
      [vehicle_id, "available"]
    );

    if (findVehicle.rows.length === 0) {
      throw new AppError("Vehicle not available", 404);
    }

    const vehicle = findVehicle.rows[0];

    const date1 = new Date(rent_start_date as string);
    const date2 = new Date(rent_end_date as string);

    const diffMs = date2.getTime() - date1.getTime();
    const diffDays = diffMs / (1000 * 3600 * 24);

    if (diffDays <= 0) {
      throw new AppError("Invalid booking dates", 400);
    }

    const total_price = Number(vehicle.daily_rent_price) * diffDays;

    const resultofBooking = await pool.query(
      `
        WITH inserted AS (
          INSERT INTO bookings
          (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        )
        SELECT inserted.*, vehicles.vehicle_name, vehicles.daily_rent_price
        FROM inserted
        JOIN vehicles ON vehicles.id = inserted.vehicle_id;
        `,
      [
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        "active",
      ]
    );

    await pool.query("UPDATE vehicles SET availability_status=$1 WHERE id=$2", [
      "booked",
      vehicle_id,
    ]);

    const responseData = resultofBooking.rows[0];
    const data = {
      id: responseData.id,
      customer_id: responseData.customer_id,
      vehicle_id: responseData.vehicle_id,
      rent_start_date: responseData.rent_start_date,
      rent_end_date: responseData.rent_end_date,
      total_price: responseData.total_price,
      status: responseData.status,
      vehicle: {
        vehicle_name: responseData.vehicle_name,
        daily_rent_price: responseData.daily_rent_price,
      },
    };
    return data || null;
  } catch (err: any) {
    throw new AppError(err.message, 500);
  }
};

const getBooking = async (req: Request) => {
  try {
    let result;
    if (req?.user?.role != "admin") {
      result = await pool.query(
        "SELECT a.* ,b.vehicle_name, b.registration_number, b.type  FROM bookings a JOIN vehicles b ON b.id=a.vehicle_id WHERE a.customer_id=$1",
        [req?.user?.id]
      );
      return result.rows.map((row) => ({
        id: row.id,
        customer_id: row.customer_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,

        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
          type: row.type,
        },
      }));
    }
    result = await pool.query(
      "SELECT a.* ,b.vehicle_name,b.registration_number,c.name,c.email FROM bookings a JOIN vehicles b ON b.id=a.vehicle_id JOIN users c ON c.id=a.customer_id"
    );
    return result.rows.map((row) => ({
      id: row.id,
      customer_id: row.customer_id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date,
      rent_end_date: row.rent_end_date,
      total_price: row.total_price,
      status: row.status,

      customer: {
        name: row.name,
        email: row.email,
      },

      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
      },
    }));
  } catch (err: any) {
    throw new AppError(err.message, 500);
  }
};

const updateBooking = async (
  payload: Record<string, unknown>,
  user: JwtPayload,
  id: string | number
) => {
  try {
    let updateVehicle:any=null
    const findBooking = await pool.query(
      'SELECT * FROM bookings WHERE id=$1',
      [id]
    );

    if (findBooking.rows.length === 0) {
      throw new AppError("Booking not found", 404);
    }

    if (!payload.status) {
      throw new AppError("Status is required", 400);
    }

    if (user?.role === 'customer' && payload.status !== 'cancelled') {
      throw new AppError("You are only allowed to cancel the booking", 403);
    }

    if (user?.role === 'admin' && payload.status !== 'returned') {
      throw new AppError("Admin is only allowed to mark the booking as returned", 403);
    }

    const updated = await pool.query(
      'UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *',
      [payload.status, id]
    );

    const updatedRow = updated.rows[0];
    if (!updatedRow) {
      throw new AppError("Failed to update booking", 500);
    }

    if (updatedRow.status === 'cancelled' || updatedRow.status === 'returned') {
       updateVehicle= await pool.query(
        "UPDATE vehicles SET availability_status='available' WHERE id=$1 RETURNING *",
        [updatedRow.vehicle_id]
      );
    }
 
    const response= updatedRow.status === 'cancelled' ? {
      id: updatedRow.id,
      customer_id: updatedRow.customer_id,
      vehicle_id: updatedRow.vehicle_id,
      rent_start_date: updatedRow.rent_start_date,
      rent_end_date: updatedRow.rent_end_date,
      total_price: updatedRow.total_price,
      status: updatedRow.status,
     
    }
:{
      id: updatedRow.id,
      customer_id: updatedRow.customer_id,
      vehicle_id: updatedRow.vehicle_id,
      rent_start_date: updatedRow.rent_start_date,
      rent_end_date: updatedRow.rent_end_date,
      total_price: updatedRow.total_price,
      status: updatedRow.status,
      vehicle: {
        availability_status: (updateVehicle as any).rows[0].availability_status
      }
    }

    return  [response,(updatedRow as any).status];

  } catch (err: any) {
    throw new AppError(err.message, 500);
  }
};


export const bookingService = {
  createBooking,
  getBooking,
  updateBooking,
};
