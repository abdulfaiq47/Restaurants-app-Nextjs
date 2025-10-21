import { NextResponse } from "next/server";
import { connectDB } from "@/lib/route";
import productModels from "@/Models/productModels";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req) {
  try {
    let formData = await req.formData();
    const name = formData.get("name");
    const price = formData.get("price");
    const description = formData.get("description");
    const category = formData.get("category");
    const imageFile = formData.get("image"); // <-- file comes here
    if (!name || !price || !description || !category || !imageFile) {
      return NextResponse.json(
        { success: false, message: "Please fill all the fields" },
        { status: 400 }
      );
    }
    await connectDB();
    let find = await productModels.findOne({ name: name });
    if (find) {
      return NextResponse.json(
        { success: false, message: "Product already exists" },
        { status: 400 }
      );
    }
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${imageFile.name}`;

    const pathfile = path.join(process.cwd(), "public", "uploads", filename);

    await writeFile(pathfile, buffer);
    const CrProduct = await productModels.create({
      name,
      price,
      description,
      imageUrl: `/uploads/${filename}`,
      category,
    });
    CrProduct.save();
    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product: CrProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
