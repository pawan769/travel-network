import mongoose from "mongoose";
import User from "./User";
import Comment from "./Comment";

const PostSchema = new mongoose.Schema(
  {
    caption: { type: String },
    address: { type: String, required: [true, "please,enter the address"] },
    description: { type: String },
    image: {
      url: { type: String, required: [true, "image is not provided"] },
      publicId: { type: String, required: [true, "public id is not provided"] },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: [true, "author is required"],
    },
    location: {
      lat: { type: Number, required: [true, "latitude is not provided"] },
      lng: { type: Number, required: [true, "longitude is not provided"] },
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: User }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: Comment }],
  },
  { timestamps: true }
);
export default mongoose.models?.Post || mongoose.model("Post", PostSchema);
