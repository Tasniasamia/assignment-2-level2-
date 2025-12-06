import type { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service";
import { AppError } from "../../utils/error";
import { sendResponse } from "../../utils/sendResponse";

const createVehicle = async (req: Request, res: Response) => {
  
  const result = await vehiclesService.createVehicle(req.body);
  if (!result) {
    throw new AppError("Failed to create vehicle", 401);
  }
  return await sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Vehicle created successfully",
    data: result,
  });
};

const getVehicle=async(req:Request,res:Response)=>{
    let result;
    if(req?.params?.id){
    result=await vehiclesService.getVehicle(req.params.id);

    }
    result=await vehiclesService.getVehicle();
    return await sendResponse(res, {
        success: true,
        statusCode: 201,
        message:"Vehicles retrieved successfully",
        data: result,
      });
}

const getSingleVehicle=async(req:Request,res:Response)=>{
        let result;
        result=await vehiclesService.getVehicle(req.params.vehicleId);
        if(!result){
            throw new AppError("Vehicle doesn't exist",404)
        }
        return await sendResponse(res, {
            success: true,
            statusCode: 201,
            message:"Vehicles retrieved successfully",
            data: result,
          });
        }
export const vehiclesController = {
  createVehicle,getVehicle,getSingleVehicle
};
