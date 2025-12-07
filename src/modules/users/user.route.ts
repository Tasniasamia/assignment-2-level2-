import { request, response, Router } from "express";
import { isVerify } from "../../middleware/isVerify";
import { userController } from "./user.controller";
import { isAdmin } from "../../middleware/isAdmin";


const userRoute=Router();
userRoute.put('/:userId',isVerify('admin','customer'),userController.updateUser);
userRoute.get('/',isAdmin,userController.getUsers);
userRoute.delete('/:userId',isAdmin,userController.deleteUser);


export default userRoute;