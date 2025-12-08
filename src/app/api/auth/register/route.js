import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/database";
import { generateReferralCode } from "@/lib/auth";

export async function POST(req) {
  try {
    const { name, email, password, address, mobile, referralCode } = await req.json();
    await connectDB();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Verify referrer if code provided
    let validReferredBy = null;
    if (referralCode) {
        const referrer = await User.findOne({ referralCode });
        if (referrer) {
            validReferredBy = referralCode; 
        }
    }

    // Generate unique referral code for new user
    let newReferralCode = generateReferralCode(name);
    // Simple collision check (optional but good)
    let codeExists = await User.findOne({ referralCode: newReferralCode });
    while (codeExists) {
        newReferralCode = generateReferralCode(name);
        codeExists = await User.findOne({ referralCode: newReferralCode });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      address,
      mobile,
      referralCode: newReferralCode, 
      referredBy: validReferredBy
    });

    return NextResponse.json({ success: true, message: "Registered" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
