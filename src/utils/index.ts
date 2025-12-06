import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import config from "../config";

export const createHashPassword=async(password:string|any)=>{
    const hashPassword = bcrypt.hashSync(password, 10);
    return hashPassword;
}

export const matchPassword=async(password:string,hashPassword:string)=>{
    const match= await bcrypt.compare(password, hashPassword); 
    return match;
}

export const createToken=async(payload:Record<string,unknown>)=>{
const secret=config.jwt_secret as string;
const token= jwt.sign(payload,secret,{ algorithm: 'HS256',expiresIn:'24h' });
return token;
}