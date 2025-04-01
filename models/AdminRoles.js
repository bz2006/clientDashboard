import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    adminType: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("admins", adminSchema);
