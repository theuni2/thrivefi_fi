import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import User from "@/models/User";
import { verifyToken, generateReferralCode } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    // Auth Check
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Verify requesting user is admin
    const requestingAdmin = await User.findById(decoded.id);
    if (!requestingAdmin || requestingAdmin.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate referral code
    const referralCode = generateReferralCode(name);

    // Create new admin user
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      verified: true, // Auto-verify admin accounts
      referralCode,
    });

    await newAdmin.save();

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("Add Admin Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
