import Conversation from "@/models/Conversation";
import dbConnect from "@/lib/dbconnect";

export default async function createConversation(userId, postAuthorId) {
  console.log("yeha aayo");
  await dbConnect(); // Ensure the database connection is established

  try {
    // Check if a conversation already exists between the participants
    const existingConversation = await Conversation.findOne({
      participants: { $all: [userId, postAuthorId] },
    });

    if (existingConversation) {
      return existingConversation; // Return the existing conversation
    }

    // Create a new conversation
    const newConversation = new Conversation({
      participants: [userId, postAuthorId],
    });
    console.log(newConversation);

    await newConversation.save(); // Save the new conversation to the database
    return newConversation; // Return the newly created conversation
  } catch (error) {
    console.error("Error creating conversation:", error);
    return null; // Return null if an error occurs
  }
}
