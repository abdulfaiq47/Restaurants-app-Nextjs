import { connectDB } from "@/lib/route";
import { NextResponse } from "next/server";
import notifimodel from "@/Models/notifimodel";

export async function POST(req) {
  try {
    await connectDB();
    const { tableNumber } = await req.json();
    if (!tableNumber) {
      return NextResponse.json(
        { success: false, message: "Failed To get Data" },
        { status: 404 }
      );
    }
    const Created = await notifimodel.create({
      notification: tableNumber,
      time: new Date().toLocaleTimeString("en-PK", {
        timeZone: "Asia/Karachi",
        hour12: true,
      }),
    });

    return NextResponse.json(
      {
        success: true,
        message: `Notification for "${tableNumber}" created at ${Created.time}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ API Error (CrNotify):", error); // 👈 add this
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
