import mongoose from "mongoose";



const managerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "manager" },
}, { timestamps: true });

const managerModel = mongoose.models.Manager || mongoose.model("Manager", managerSchema);