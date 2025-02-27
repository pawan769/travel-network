export async function GET(req, { params }) {
  try {
    await dbConnect();

    // ✅ Directly destructure params
    const { conversationId } = params;

    const conversation = await Conversation.findById(conversationId).populate(
      "participants"
    );

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(conversation, { status: 200 });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}
