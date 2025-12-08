import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    address: { type: String },
    mobile: { type: String },
    referralCode: { type: String, unique: true },
    referredBy: { type: String },
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date },
    progress: {
      completedChapters: { type: [String], default: [] },
      quizScores: { type: Object, default: {} },
    }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
