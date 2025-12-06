import { pool } from "../../config/db";
import { AppError } from "../../utils/error";

const createVehicle=async(payload:Record<string,unknown>)=>{
try{
const{vehicle_name,type,registration_number,daily_rent_price,availability_status}=payload;
console.log("payload",payload)
const vehicle=await pool.query('INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *',[vehicle_name,type,registration_number,daily_rent_price,availability_status]);
return vehicle.rows[0];
}
catch(err:any){
    throw new AppError(err.message,500);
}
}

const getVehicle=async(id?:Number|string|any)=>{
    try{
    let vehicle;
    if(!id){
        vehicle=await pool.query('SELECT * FROM vehicles');
        return vehicle.rows;
    }
    vehicle=await pool.query(`SELECT * FROM vehicles WHERE id=$1`,[id]);
    return vehicle.rows[0];
}
catch(err:any){
    throw new AppError(err.message,500);
}
}


export const vehiclesService={
    createVehicle,getVehicle
}