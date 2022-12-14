import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendMail from "../helpers/sendMail.js";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

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

  const mailOptions = {
    from: process.env.MAIL_USER,
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

  sendMail(mailOptions)
    .then((info) => {
      return res
        .status(201)
        .json({ success: true, message: `Email sent to ${email}` });
    })
    .catch((error) => {
      return res.status(201).json({ status: 401, error });
    });
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
  if (!bcrypt.compareSync(password, user.password)) {
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

export const forget = async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res
      .status(403)
      .json({ success: false, message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "User not found.Please Signup" });

  // Generate Token
  const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
    expiresIn: "10m",
  });

  // email data sending
  const emailData = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "TAHAWY PASSWORD RESET LINK",
    html: `
    <h1>Please click on link to reset</h1>
    <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
    <hr/>
    <p>This email contain senstive info</p>
    <p>${process.env.CLIENT_URL}</p>
`,
  };

  sendMail(emailData);

  try {
    const updatedUser = await User.findOneAndUpdate(
      {
        reset_passwordLink: token,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: true, message: `Email has been sent to ${email}` });
  } catch (error) {}
};

export const reset = async (req, res) => {
  const { newPassword, resetPasswordLink } = req.body;

  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      (error, decoded) => {
        if (error)
          return res
            .status(401)
            .json({ success: false, message: "Expired link. Try again" });
      }
    );

    const user = await User.findOne({ resetPasswordLink });
    if (!user)
      return res.status(404).json({
        success: false,
        message:
          "Something went wrong Please try again from the beginning and send email",
      });

    user.reset_passwordLink = "";
    user.password = await bcrypt.hash(newPassword, 10);

    try {
      await user.save();
      res.status(200).json({
        success: true,
        message: "Great! Now you can login with new password",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Error while reseting user password",
      });
    }
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = (req, res) => {
  const { idToken } = req.body;

  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      console.log("GOOGLE LOGIN RESPONSE", response);
      const { email_verified, name, email } = response.payload;

      if (email_verified) {
        User.findOne({ email }).exec(async (err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            let password = await bcrypt.hash(
              email + process.env.JWT_SECRET,
              10
            );
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with google",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again",
        });
      }
    });
};

export const facebookLogin = async (req, res) => {
  const { userId, accessToken } = req.body;
  const url = `https://graph.facebook.com/v2.11/${userId}?fields=id,name,email&access_token=${accessToken}`;

  const fetchRes = await axios.get(url);
  const { email, name } = fetchRes.data;
  const user = await User.findOne({ email });

  if (user) {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { _id, email, name, role } = user;
    return res.status(200).json({
      token,
      user: { _id, email, name, role },
    });
  } else {
    let password = await bcrypt.hash(email + process.env.JWT_SECRET, 10);
    const user = new User({ name, email, password });
    try {
      const savedUser = await user.save();
      const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      const { _id, email, name, role } = savedUser;
      return res.status(201).json({
        token,
        user: { _id, email, name, role },
      });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: "User signup failed with facebook" });
    }
  }
};

const validateEmail = (email) => {
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
};
