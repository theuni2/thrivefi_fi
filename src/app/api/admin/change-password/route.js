import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
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

    // Fetch admin user
    const adminUser = await User.findById(decoded.id);
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      adminUser.password
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    adminUser.password = hashedPassword;
    await adminUser.save();

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
