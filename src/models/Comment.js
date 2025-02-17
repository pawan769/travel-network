import mongoose from "mongoose";
import User from "./User";

const CommentSchema = new mongoose.Schema(
  {
    comment: { type: String, required: [true, "Please type a comment"] },
    commenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: [true, "Please state the commenter"],
    },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);
export default mongoose.models?.Comment ||
  mongoose.model("Comment", CommentSchema);
