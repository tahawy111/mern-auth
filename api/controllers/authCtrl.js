import User from "../models/User.js";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";

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

  const emailData = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: "TAHAWY ACTIVATION LINK",
    html: `
        <h1>Please click on link to activate</h1>
        <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
        <hr/>
        <p>This email contain senstive info</p>
        <p>${process.env.CLIENT_URL}</p>
    `,
  };

  sendMail(emailData);

  return res.status(200).json({
    success: true,
    message: `Email has been sent to ${email}`,
  });
};

const validateEmail = (email) => {
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
};
