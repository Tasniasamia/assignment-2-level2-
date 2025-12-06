import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import { isAdmin } from "../../middleware/isAdmin";

const vehiclesRoute=Router();
vehiclesRoute.post('/',isAdmin,vehiclesController.createVehicle);
vehiclesRoute.get('/',vehiclesController.getVehicle);
vehiclesRoute.get('/:vehicleId',vehiclesController.getSingleVehicle);

export default vehiclesRoute;