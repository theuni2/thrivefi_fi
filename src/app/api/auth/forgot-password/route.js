import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/database";
import { Resend } from "resend";
import { generateVerificationCode } from "@/lib/auth";
import { generateEmailTemplate } from "@/lib/emailTemplates";

export async function POST(req) {
  try {
    const { email } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      // For security, do not reveal if user does not exist, but for this app we can simply return error
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const otp = generateVerificationCode();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = expiry;
    await user.save();

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Reset Your Password",
            html: generateEmailTemplate({
                title: "Reset Your Password",
                message: "Thank you for signing up. Please use the verification code below to complete your registration and activate your account.",
                code: otp,
                footerText: "If you didn't create an account, you can safely ignore this email."
            }),
        });
    } catch (emailError) {
        console.error("Resend Error:", emailError);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "OTP sent to email" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
