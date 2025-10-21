import mongoose from "mongoose";
import { connectDB } from "@/lib/route";
import productModels from "@/Models/productModels";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const product = await productModels.find();
    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
