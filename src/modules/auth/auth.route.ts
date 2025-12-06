import { Router } from "express";
import { authController } from "./auth.controller";

const authRoute=Router();
authRoute.use('/signup',authController.signupController);
authRoute.use('/signin',authController.signinController)
export default authRoute;