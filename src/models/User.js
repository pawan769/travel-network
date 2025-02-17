import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"] },
    bio: { type: String }, // Adding bio as well
    profilePic: {
      url: { type: String },
      publicId: { type: String },
    },
  },
  { timestamps: true } // Enables automatic timestamps
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
