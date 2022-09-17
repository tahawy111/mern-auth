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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
routes(app);

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
