import managerModel from "@/Models/managerModel";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/route";
import bcrypt from "bcryptjs";


export async function POST(req) {
  try {
    await connectDB();

    const { email, password, secret } = await req.json();
    const Secretkey = process.env.SECRET_CODE;

    // 🧩 Basic validation
    if (!email || !password || !secret) {
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });
    }

    // 🧩 Secret key check
    if (Secretkey !== secret) {
      return NextResponse.json({
        success: false,
        message: "Invalid secret key",
      });
    }

    // 🧩 Find manager by email
    const manager = await managerModel.findOne({ email });
    if (!manager) {
      return NextResponse.json({
        success: false,
        message: "Email not found",
      });
    }

    // 🧩 Compare password
    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) {
      return NextResponse.json({
        success: false,
        message: "Invalid password",
      });
    }

    return NextResponse.json(
      { success: true, message: "Logged in successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/crmanager:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
