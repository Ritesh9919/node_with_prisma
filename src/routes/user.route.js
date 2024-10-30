import express from "express";
const router = express.Router();
import {
  register,
  login,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

router.post("/register", register);
router.post("/login", login);
router.get("/:userId", verifyJwt, getUser);
router.get("/", verifyJwt, getAllUsers);
router.put("/:userId", verifyJwt, updateUser);
router.delete("/:userId", verifyJwt, deleteUser);

export default router;
