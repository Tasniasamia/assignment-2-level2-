import { pool } from "../../config/db";
import { AppError } from "../../utils/error";

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
  
      // INSERT booking + return relational data
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
  
      await pool.query(
        "UPDATE vehicles SET availability_status=$1 WHERE id=$2",
        ["booked", vehicle_id]
      );
  
      const responseData=resultofBooking.rows[0];
      const data={
        id: responseData.id,
        customer_id: responseData.customer_id,
        vehicle_id: responseData.vehicle_id,
        rent_start_date: responseData.rent_start_date,
        rent_end_date:  responseData.rent_end_date,
        total_price: responseData.total_price,
        status: responseData.active,
        vehicle: {
          vehicle_name: responseData.vehicle_name,
          daily_rent_price: responseData.daily_rent_price
        }
      }
      return data || null;

    } catch (err: any) {
      throw new AppError(err.message, 500);
    }
  };
  

export const bookingService = {
  createBooking,
};
