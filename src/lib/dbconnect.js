import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const dbConnect = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongoose connection is established successfully");
  } catch (error) {
    throw new Error("Error connecting to mongoose", error);
  }
};

export default dbConnect;
