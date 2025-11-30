import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/database";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 400 }
      );
    }

    const token = signToken({ id: user._id, email: user.email });

    const response = NextResponse.json({ 
      success: true, 
      role: user.role,
      redirectUrl: user.role === "admin" ? "/dashboard" : "/profile"
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}