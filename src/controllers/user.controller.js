import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const isUserExist = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (isUserExist) {
      return next(new ApiError(400, "User already exist"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return next(new ApiError(401, "Invalid credential"));
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return next(new ApiError(401, "Invalid credential"));
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 86400000,
      })
      .status(200)
      .json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await db.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const { userId } = req.params;
    if (req.userId !== userId) {
      return next(new ApiError(400, "You can only update your account"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        password: hashedPassword,
      },
    });
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (req.userId !== userId) {
      return next(new ApiError(400, "You can only delete your account"));
    }
    await db.user.delete({
      where: {
        id: userId,
      },
    });
    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
