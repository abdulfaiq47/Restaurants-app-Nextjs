import mongoose from "mongoose";

const MOGNODB_URL = process.env.MONGODB_URL;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MOGNODB_URL, {
      dbName: "Restaurant",
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  if (cached.conn) {
    console.log("MongoDB Connected");
    return cached.conn;
  }
};
