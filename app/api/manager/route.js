import managerModel from "@/Models/managerModel";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/route";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password, secret } = await req.json();
    const Secretkey = process.env.SECRET_CODE;
    if (!email || !password || !secret) {
      return NextResponse.json({
        success: false,
        message: "Invalid Credentailas",
      });
    }
    await connectDB();
    const find = await managerModel.findOne({ email });
    if (!find) {
      return NextResponse.json({
        success: false,
        message: "Invalid Credentailas",
      });
    }
    if (Secretkey !== secret) {
      return NextResponse.json({
        success: false,
        message: "Invalid Credentailas ",
      });
    }

    const saltRounds = 10;

    const PH = await bcrypt.compare(password, find.password);
    if (!PH) {
      return NextResponse.json({
        success: false,
        message: "Invalid Credentailas",
      });
    }

    return NextResponse.json(
      { success: true, message: "LoggedIn" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
