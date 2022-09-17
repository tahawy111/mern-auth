import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import nodemailer from "nodemailer";
const app = express();
dotenv.config({
  path: "./config/config.env",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// config for only development
if (process.env.NODE_DEV === "development") {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );

  app.use(morgan("dev"));
  // morgan gives information about each request
}

routes(app);

app.post("/send_mail", async (req, res) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    auth: { user: "amerfake55@gmail.com", pass: "amer@AA@582" },
  });
  const info = await transport.sendMail({
    from: "amerfake55@gmail.com",
    to: "amer.vib582@gmail.com",
    subject: "test email",
    html: "Email test",
  });

  if (info.messageId) {
    res.send("email sent");
  }
});

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Page not founded" });
});

// connect to mongodb
const URI = process.env.MONGODB_URI;
mongoose.connect(URI, () => console.log("DB Connected"));

const port = process.env.PORT || 5001;
app.listen(5000, () => {
  console.log("Server is running on port", port);
});
