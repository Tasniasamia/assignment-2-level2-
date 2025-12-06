import { Router } from "express";
import { authController } from "./auth.controller";

const authRoute=Router();
authRoute.post('/signup',authController.signupController);
authRoute.post('/signin',authController.signinController)
export default authRoute;