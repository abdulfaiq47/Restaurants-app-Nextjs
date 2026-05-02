import mongoose from "mongoose";



const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true },
  status: { type: String, enum: ['available', 'occupied', 'reserved'], default: 'available' },
}, { timestamps: true });

const tableModel = mongoose.models.Table || mongoose.model("Table", tableSchema);

export default tableModel;