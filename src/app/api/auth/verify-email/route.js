import { Resend } from "resend";
import { generateVerificationCode, decodeToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/database";
import { generateEmailTemplate } from "@/lib/emailTemplates";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = decodeToken(token);
    const email = decoded.email;

    const resend = new Resend(process.env.RESEND_API_KEY);

    const verificationCode = generateVerificationCode();

    await resend.emails.send({
      from: "no-reply@thethrivefi.com",
      to: email,
      subject: "Verify Your Email",
      html: generateEmailTemplate({
        title: "Welcome to Our Platform!",
        message: "Thank you for signing up. Please use the verification code below to complete your registration and activate your account.",
        code: verificationCode,
        footerText: "If you didn't create an account, you can safely ignore this email."
      }),
    });

    return NextResponse.json({
      success: true,
      verificationCode: verificationCode,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = decodeToken(token);
    const email = decoded.email;

    await connectDB();

    const user = await User.findOneAndUpdate({ email }, { verified: true });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error Updating verification status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update verification status" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = decodeToken(token);
    // console.log("Decoded : ", decoded);
    const email = decoded.email;

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      isVerified: user.verified || false,
      email: user.email,
    });
  } catch (error) {
    console.error("Error checking verification status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check verification status" },
      { status: 500 }
    );
  }
}
