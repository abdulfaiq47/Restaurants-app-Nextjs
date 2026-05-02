import mongoose from "mongoose";

const ProductModel = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },

})

export default mongoose.models.Product || mongoose.model("Product", ProductModel);