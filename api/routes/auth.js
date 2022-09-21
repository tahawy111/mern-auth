import express from "express";
import {
  activation,
  forget,
  login,
  register,
  reset,
  googleLogin,
  facebookLogin,
} from "../controllers/authCtrl.js";
const router = express.Router();

router.post("/register", register);
router.post("/activation", activation);
router.post("/login", login);
router.post("/password/forget", forget);
router.put("/password/reset", reset);
router.post("/googlelogin", googleLogin);
router.post("/facebooklogin", facebookLogin);

export default router;
