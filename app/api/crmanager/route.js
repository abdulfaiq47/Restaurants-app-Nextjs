import managerModel from "@/Models/managerModel";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/route";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password, secret } = await req.json();
    const Secretkey = process.env.SECRET_CODE;

    // 🧩 Basic validation
    if (!name ||!email || !password || !secret) {
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
    if (manager) {
      return NextResponse.json({
        success: false,
        message: "Already have account",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 🧩 Compare password
    const CreateModel = await managerModel.create({
      name,
      email,
      password: hashedPassword
    });


    return NextResponse.json(
      { success: true, message: "Sign up  successfully" },
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
