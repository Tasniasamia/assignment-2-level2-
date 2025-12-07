import { pool } from "../config/db";

const autoReturn = async () => {
  await pool.query(`
    UPDATE bookings
    SET status = 'returned'
    WHERE rent_end_date < CURRENT_DATE
      AND status = 'active';
  `);

  await pool.query(`
    UPDATE vehicles
    SET availability_status = 'available'
    WHERE id IN (
      SELECT vehicle_id 
      FROM bookings 
      WHERE status = 'returned'
        AND rent_end_date < CURRENT_DATE
    );
  `);

  console.log("Auto return job executed");
};

export default autoReturn;
