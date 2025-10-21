import mongoose from "mongoose";
import tableModel from "@/Models/tablemodeels";
import { connectDB } from "@/lib/route";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { tableNumber, status } = await req.json();

        await connectDB();

        let CreateTable = await tableModel.create({
            tableNumber, status
        })
        CreateTable.save();
        return NextResponse.json({
            success: true, message: "Table created successfully", table: CreateTable
        } , { status: 201 } );
    } catch (error) {
        
        return NextResponse.json({
            success: false, message: error.message
        } , { status: 500 } );
        
    }
}