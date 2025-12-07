import { pool } from "../../config/db";
import { AppError } from "../../utils/error";

const createVehicle = async (payload: Record<string, unknown>) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = payload;
    const vehicle = await pool.query(
      "INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *",
      [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
      ]
    );
    return vehicle.rows[0] || null;
  } catch (err: any) {
    throw new AppError(err.message, 500);
  }
};

const getVehicle = async (id?: Number | string | any) => {
  try {
    let vehicle;
    if (!id) {
      vehicle = await pool.query("SELECT * FROM vehicles");
      return vehicle.rows;
    }
    vehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
    return vehicle.rows[0] || null;
  } catch (err: any) {
    throw new AppError(err.message, 500);
  }
};

const updateVehicle = async (
  payload: Record<string, unknown>,
  id: Number | string | any
) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = payload;
    const vehicle = await pool.query(
        `
        UPDATE vehicles 
        SET 
          vehicle_name = $1,
          type = $2,
          registration_number = $3,
          daily_rent_price = $4,
          availability_status = $5
        WHERE id = $6
        RETURNING *;
        `,
        [
          vehicle_name,
          type,
          registration_number,
          daily_rent_price,
          availability_status,
          id,
        ]
      );
  
    return vehicle.rows[0] || null;
  } catch (err: any) {
    throw new AppError(err.message, 500);
  }
};

const deleteVehicle=async(id:Number|string|any)=>{
    try{
         const vehicle=await pool.query(
            "DELETE FROM vehicles WHERE id = $1 RETURNING *",
            [id]
          );
         
        return vehicle.rowCount;
    }
    catch(err:any){
        throw new AppError(err.message,500)
    }
}

export const vehiclesService = {
  createVehicle,
  getVehicle,
  updateVehicle,
  deleteVehicle
};
