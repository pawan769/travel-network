import mongoose from "mongoose";
import User from "./User";

const PostSchema = new mongoose.Schema(
  {
    caption: { type: String,  },
    image: {
      url: { type: String, required: [true, "image is not provided"] },
      publicId: { type: String, required: [true, "public id is not provided"] },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: [true, "author is required"],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: User }],
  },
  { timestamps: true }
);
export default mongoose.models.Post || mongoose.model("Post", PostSchema);
