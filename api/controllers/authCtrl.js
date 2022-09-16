import User from "../models/User.js";
import expressJwt from "express-jwt";
// const _ = require("loadash");
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  console.log({ name, email, password });

  res.status(200).json({
    success: true,
    message: "Register Route",
  });
};
