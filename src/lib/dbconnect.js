import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false; // Track the connection status

const dbConnect = async () => {
  if (isConnected) {
    console.log("MongoDB is already connected.");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "travelNetwork", // Make sure to target the correct database
    });

    isConnected = true; // Mark as connected
    console.log("✅ MongoDB connected successfully.");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Database connection failed");
  }
};

export default dbConnect;
