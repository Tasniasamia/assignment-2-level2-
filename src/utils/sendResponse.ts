import type { Response } from "express";

export const sendResponse=async(res:Response,data:Record<string,unknown>)=>{
return res.status(data.statusCode as number).json({
    success:data?.success,
    message:data?.message,
    data:data?.data
})
}