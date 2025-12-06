import { Router } from "express";
import authRoute from "../modules/auth/auth.route";

const route=Router();

const allRoutes=[
    {
        path:'/auth',
        handler:authRoute
    }
]
allRoutes.forEach((i)=>route.use(i?.path,i?.handler))
export default route;