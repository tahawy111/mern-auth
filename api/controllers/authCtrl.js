import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

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

  const hashedPassword = await bcrypt.hash(password, 10);

  const token = jwt.sign(
    { name, email, password: hashedPassword },
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
      <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
      <hr/>
      <p>This email contain senstive info</p>
      <p>${process.env.CLIENT_URL}</p>
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
};

export const activation = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      async (err, decode) => {
        if (err) {
          return res
            .status(401)
            .json({ success: false, message: "Expired token. Signup again" });
        } else {
          const { name, email, password } = decode;
          try {
            const newUser = User({ name, email, password });

            const user = await newUser.save();
            return res
              .status(201)
              .json({ success: true, message: "Signup success", user });
          } catch (error) {
            return res.status(401).json({ success: false, error });
          }
        }
      }
    );
  } else {
    return res
      .status(403)
      .json({ success: false, message: "token is required" });
  }
};

export const login = async (req, res) => {
  const { password } = req.body;
  if (!req.body.email || !password) {
    return res.status(401).json({
      success: false,
      message: "Please fill in all fields",
    });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(401).json({
      success: false,
      message: "User with that email does not exist. Please signup",
    });

  // comparing passwords
  if (!bcrypt.compare(password, user.password)) {
    return res.status(401).json({
      success: false,
      message: "Password dosen't match",
    });
  }

  // generate token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const { _id, name, email, role } = user;

  return res.status(200).json({
    success: true,
    token,
    user: { _id, name, email, role },
  });
};

const validateEmail = (email) => {
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
};
