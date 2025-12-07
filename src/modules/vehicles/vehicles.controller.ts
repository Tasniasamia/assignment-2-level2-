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

const updateVehicle=async(req:Request,res:Response)=>{
  const result=await vehiclesService.updateVehicle(req.body,req.params.vehicleId);
  if(!result){
    throw new AppError("Failed to update vehicle", 401);

  }
  return await sendResponse(res, {
    success: true,
    statusCode: 200,
    message:"Vehicles updated successfully",
    data: result,
  });

}

const deleteVehicle = async (req: Request, res: Response) => {
   if (!req.params.vehicleId) {
      throw new AppError("vehicleId is required", 400);
    }
    const result = await vehiclesService.deleteVehicle(req?.params.vehicleId)

    if (!result) {
      throw new AppError("Vehicle not found", 404);
    }

    return await sendResponse(res, {
      success: true,
      statusCode: 200,
      message:"Vehicle deleted successfully",
    });
  }



      
export const vehiclesController = {
  createVehicle,getVehicle,getSingleVehicle,updateVehicle,deleteVehicle
};
