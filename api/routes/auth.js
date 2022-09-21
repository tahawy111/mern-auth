import express from "express";
import {
  activation,
  forget,
  login,
  register,
  reset,
} from "../controllers/authCtrl.js";
const router = express.Router();

router.post("/register", register);
router.post("/activation", activation);
router.post("/login", login);
router.post("/password/forget", forget);
router.put("/password/reset", reset);

export default router;
