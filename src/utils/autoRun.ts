import cron from "node-cron";
import { pool } from "../config/db";

const autoReturn = async () => {
  await pool.query(`
    UPDATE bookings
    SET status = 'returned',
        actual_return_date = rent_end_date,
        returned_at = NOW()
    WHERE rent_end_date < CURRENT_DATE
      AND status = 'active';
  `);

  await pool.query(`
    UPDATE vehicles
    SET availability_status = 'available'
    WHERE id IN (
      SELECT vehicle_id FROM bookings
      WHERE status='returned'
        AND actual_return_date=CURRENT_DATE
    );
  `);

  console.log("Auto return job executed at midnight");
};

cron.schedule("0 0 * * *", async () => {
  try {
    await autoReturn();
  } catch (err) {
    console.error("AutoReturn Error:", err);
  }
});
