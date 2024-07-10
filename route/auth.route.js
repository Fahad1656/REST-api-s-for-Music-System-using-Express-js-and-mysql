import express from 'express';
import {  forgetcontroller, loginController,  profilecontroller, registerController, resetcontroller,  updateprofilecontroller } from "../controller/auth.controller.js";
import { verifyAuthUser } from '../middleware/auth.middleware.js';


const authRoute = express.Router();

authRoute.post('/login', loginController);
authRoute.post('/register', registerController);
authRoute.post("/forget",forgetcontroller);
authRoute.patch('/reset',verifyAuthUser,resetcontroller);


authRoute.get('/profile',verifyAuthUser,profilecontroller);
authRoute.patch("/updateprofile",verifyAuthUser, updateprofilecontroller);



export default authRoute;
