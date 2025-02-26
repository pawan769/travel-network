import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true } // Enables automatic timestamps (createdAt, updatedAt)
);

// ✅ Ensure Mongoose models object exists before accessing it
const Conversation =
  mongoose.models?.Conversation ||
  mongoose.model("Conversation", ConversationSchema);

export default Conversation;
