import type { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";
import type { Request } from "express";
import { AppError } from "../../utils/error";

const updateUser = async (
  payload: Record<string, unknown>,
  user: JwtPayload,
  id: string | number
) => {
  const { name, email, phone, role } = payload;

  const findUser = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
  const dbUser = findUser.rows[0];

  if (!dbUser) {
    return null;
  }

  if (user?.role === "admin") {
    const updated = await pool.query(
      `
      UPDATE users
      SET name=$1, email=$2, phone=$3, role=$4
      WHERE id=$5
      RETURNING *;
      `,
      [name, email, phone, role, id]
    );

    return updated.rows[0] || null;
  }

  if (user?.id == id) {
    const updated = await pool.query(
      `
      UPDATE users
      SET name=$1, email=$2, phone=$3
      WHERE id=$4
      RETURNING id,name,email,phone,role;
      `,
      [name, email, phone, id]
    );

    return updated.rows[0] || null;
  }

  return null;
};

const getUsers = async () => {
  const users = await pool.query("SELECT id,name,email,phone,role FROM users");
  return users.rows;
};

const deleteUser = async (id: Number | string | any) => {
  try {
    const activeBookingOfUser = await pool.query(
      `SELECT * FROM bookings WHERE customer_id=$1 AND status=$2`, 
      [id, "active"]
    );
   if(activeBookingOfUser.rows.length>0){
    throw new AppError('Cannot Delete User , Already booking exists',400)
   }
    const user = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    return user.rowCount;
  } catch (err: any) {
    throw new AppError(err.message, 500);
  }
}

export const userService = {
  updateUser,
  getUsers,
  deleteUser,
};
