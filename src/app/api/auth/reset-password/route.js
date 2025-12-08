import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/database";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();
    await connectDB();

    const user = await User.findOne({ 
        email, 
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    return NextResponse.json({ success: true, message: "Password reset successfully" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
