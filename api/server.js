import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./routes/index.js";
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
