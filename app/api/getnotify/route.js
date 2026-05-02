import { connectDB } from "@/lib/route";
import notifimodel from "@/Models/notifimodel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const notifications = await notifimodel.find().sort({ _id: -1 });

    return NextResponse.json({
      success: true,
      notifications, // 👈 key name matches frontend
    });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
