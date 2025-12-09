import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();

    // Auth Check
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Fetch admin user details
    const adminUser = await User.findById(decoded.id)
      .select("-password")
      .lean();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: adminUser,
    });
  } catch (error) {
    console.error("Admin Profile Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
