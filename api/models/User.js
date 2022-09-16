import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: String,
      default: "Normal",
    },
    reset_passwordLink: { data: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("user", userSchema);
