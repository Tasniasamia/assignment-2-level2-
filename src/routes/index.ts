import { Router } from "express";
import authRoute from "../modules/auth/auth.route";
import vehiclesRoute from "../modules/vehicles/vehicles.route";
import userRoute from "../modules/users/user.route";

const route=Router();

const allRoutes=[
    {
        path:'/auth',
        handler:authRoute
    },
    {
        path:'/vehicles',
        handler:vehiclesRoute
    },
    {
        path:'/users',
        handler:userRoute
    }
]
allRoutes.forEach((i)=>route.use(i?.path,i?.handler))
export default route;