import { pool } from "../../config/db"
import { createHashPassword, createToken, matchPassword } from "../../utils";
import { AppError } from "../../utils/error";

const signupService=async(payload:Record<string,unknown>)=>{
    try{
    const {name,email,password,phone,role}=payload;
    if(!name || !email || !password || !phone || !role){
        return null;
    }
    const hashPassword=await createHashPassword(password)
    const createUser = await pool.query(
        `INSERT INTO users (name, email, password, phone, role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id,name,email,phone,role`,
        [name, email, hashPassword, phone, role]
      );
      
    return createUser.rows[0];
    }
    catch(err:any){
        throw new AppError(err.message,500);
    }
}
const signinService=async(email:string,password:string)=>{

const findUser=await pool.query('SELECT * FROM users WHERE email=$1',[email])
const user=findUser.rows[0];
if(!user){
    throw new AppError('Unauthorized User',401);
}
const match=matchPassword(user?.password,password);
if(!match){
    throw new AppError('Password not matched',401)
}
const token=await createToken({name:user?.name,email:user?.email,role:user?.role});
return {
token:token,
user:{
    id:user?.id,
    name:user?.name,
    email:user?.email,
    phone:user?.phone,
    role:user?.role
}
}

}
export const authService={
    signupService,
    signinService
}