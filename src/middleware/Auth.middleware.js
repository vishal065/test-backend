import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { UserModel } from "../model/user.model.js";

const AuthMiddleware = asyncHandler(async (req, res, next) => {
  const role = req.cookies?.role;

  if (role === "user") {
    await UserAuth(req, res);

    next();
  } else if (role === "admin") {
    await AdminAuth();
    next();
  } else {
    return res.status(400).json({ message: "unauthorized user" });
  }
});

const UserAuth = async (req, res) => {
  const token = req.cookies?.token;

  if (!token) return res.status(400).json({ message: "Unauthenticated" });

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const user = await UserModel.findById(decodedToken._id).select(
    "-password -createdAt -updatedAt -__v"
  );

  if (!user) {
    return res.status(400).json({ message: "Invalid User" });
  }

  req.user = user;
};
const AdminAuth = async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(400).json({ message: "Unauthenticated" });
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const admin = await UserModel.findById(decodedToken._id).select(
    "-password -createdAt -updatedAt -__v"
  );
  if (!user) {
    return res.status(400).json({ message: "Invalid User" });
  }
  req.user = user;
};

export default AuthMiddleware;
