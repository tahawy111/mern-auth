const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const { default: mongoose } = require("mongoose");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
require("./routes")(app);

// connect to mongodb
const URI = process.env.MONGODB_URI;
mongoose.connect(URI, () => console.log("DB Connected"));

const port = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log("Server is running on port", port);
});
