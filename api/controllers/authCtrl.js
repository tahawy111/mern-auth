import User from "../models/User.js";
import expressJwt from "express-jwt";
// const _ = require("loadash");
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  console.log({ name, email, password });

  if (!name || !email || !password) {
    return res.status(401).json({
      success: false,
      message: "Please fill in all fields",
    });
  }

  const user = await User.findOne({ email });
  if (user) {
    return res.status(403).json({
      success: false,
      message: "User is aleardy exist",
    });
  }

  if (password.length < 6) {
    return res.status(401).json({
      success: false,
      message: "password must be at least 6 characters",
    });
  }

  const token = jwt.sign(
    { name, email, password },
    process.env.JWT_ACCOUNT_ACTIVATION,
    {
      expiresIn: "15m",
    }
  );

  const emailData = {
    form: process.env.EMAIL_FORM,
    to: to,
    subject: "TAHAWY ACTIVATION LINK",
    html: `
        <h1>Please click on link to activate</h1>
        <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
        <hr/>
        <p>This email contain senstive info</p>
        <p>${process.env.CLIENT_URL}</p>
    `,
  };

  return res.status(200).json({
    success: true,
    message: "Register Route",
  });
};
