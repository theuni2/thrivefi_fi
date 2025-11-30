import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("❌ MONGODB_URI is missing in .env.local");
  }

  if (isConnected) return;

  try {
    await mongoose.connect(uri, {
      dbName: "ThriveFiDB",
      tls: true,            // required for Windows + Atlas
      tlsAllowInvalidCertificates: false,
      serverSelectionTimeoutMS: 8000,
    });

    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
