import { Router } from "express";
import { loginUser, registeredUser } from "../controller/user.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const UserRouter = Router();

UserRouter.route("/signup").post(asyncHandler(registeredUser));
UserRouter.route("/login").post(asyncHandler(loginUser));

export default UserRouter;
