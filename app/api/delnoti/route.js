import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/route";
import NotificationModel from "@/Models/notifimodel";

export async function DELETE(req) {
  try {
    let { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "Not Found !" });
    }

    await connectDB();

    // ✅ Delete the notification by ID
    const deleted = await NotificationModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
