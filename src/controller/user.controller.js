import { StatusCodes } from "http-status-codes";
import { UserModel } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { z } from "zod";

const GenerateToken = (_id, email) => {
  return jwt.sign({ _id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const UserSchemaValidation = z.object({
  email: z.string().email(),
  phone: z.string().min(2).max(12),
  password: z.string().min(2).max(16),
});

const registeredUser = async (req, res) => {
  const userData = req.body;
  const validateData = UserSchemaValidation.safeParse(userData);
  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }
  console.log("validateData", validateData.data);

  const existUser = await UserModel.findOne({
    $or: [
      { email: validateData.data.email },
      { phone: validateData.data.phone },
    ],
  });
  console.log("existUser", existUser);

  if (existUser) {
    return res.status(StatusCodes.OK).json({
      message: "User already Exist",
    });
  }

  const savedUser = await UserModel.create(validateData.data);
  console.log("savedUser", savedUser);

  const data = savedUser.toObject();
  delete data.password;

  if (!savedUser) {
    return res.status(500).json({ message: "Failed to register user" });
  }

  const token = GenerateToken(savedUser._id, savedUser.email);
  console.log("token", token);

  res
    .cookie("token", token, {
      httpOnly: false,
      secure: true,
    })
    .cookie("role", data.role, {
      httpOnly: false,
      secure: true,
    });
  return res.status(StatusCodes.OK).json({
    message: "User registered successfull",
    ...data,
    token,
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const existUser = await UserModel.findOne({ email });

  if (!existUser) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const checkPassword = await existUser.comparePassword(password);

  if (!checkPassword) {
    return res.status(400).json({ message: "Password does not match" });
  }

  const token = GenerateToken(existUser._id, email);
  const user = existUser.toObject();
  delete user.password;
  const accessCookie = {
    sameSite: "none",
    maxAge: 1000 * 60 * 60, // 1 hour
    partition:"",
    httpOnly: true,
    secure: true,
  };
  const accessCookie2 = {
    sameSite: "lax",
    maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true,
    secure: true,
  };
  res
    .cookie("token", token, accessCookie)
    .cookie("role", "user", accessCookie2);

  return res.status(StatusCodes.OK).json({
    message: "Login Succesfull",
    ...user,
    token,
  });
};

export { registeredUser, loginUser };
