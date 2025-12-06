import { Router } from "express";
import authRoute from "../modules/auth/auth.route";
import vehiclesRoute from "../modules/vehicles/vehicles.route";

const route=Router();

const allRoutes=[
    {
        path:'/auth',
        handler:authRoute
    },
    {
        path:'/vehicles',
        handler:vehiclesRoute
    }
]
allRoutes.forEach((i)=>route.use(i?.path,i?.handler))
export default route;