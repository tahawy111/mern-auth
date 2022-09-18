import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(401).json({
      success: false,
      message: "Please fill in all fields",
    });
  }

  if (validateEmail(email)) {
    return res.status(403).json({
      success: false,
      message: "Invalid email",
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
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: { user: "amer.vib582@gmail.com", pass: "mwigegzkbjjmgpmc" },
    });

    const mailOptions = {
      from: "amer.vib582@gmail.com",
      to: "elfathstore.ymka@gmail.com",
      subject: "TAHAWY ACTIVATION LINK",
      html: `
        <h1>Please click on link to activate</h1>

    `,
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log({ error });
      } else {
        console.log("email sent", info);
        return res.status(201).json({ status: 201, info });
      }
    });
  } catch (error) {
    return res.status(201).json({ status: 401, error });
  }

  // // SEND MAIL
};

const validateEmail = (email) => {
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
};
