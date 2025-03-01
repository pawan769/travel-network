import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error("Please define the MONGODB_URI environment variable");
// }

let isConnected = false;

const dbConnect = async () => {
  if (isConnected) {
    console.log("MongoDB is already connected.");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "travelNetwork",
      useNewUrlParser: true, // Optional, for older Mongoose versions
      useUnifiedTopology: true, // Optional
    });

    isConnected = true;
    console.log("✅ MongoDB connected successfully.");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Database connection failed");
  }
};

export default dbConnect;
