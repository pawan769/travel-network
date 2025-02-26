"use client";
import createConversation from "@/app/utils/createConversation";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeConversation, setActiveConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useSession();
  const currentUserId = session?.user?.id; // Get the current user's ID from the session
  const currentUserName = session?.user?.name;

  useEffect(() => {
    console.log("Conversations:", conversations);
  }, [conversations]);

  // Fetch all conversations for the user
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch("/api/conversations"); // Replace with your API endpoint
        const data = await response.json();
        setConversations(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Fetch messages for the active conversation
  useEffect(() => {
    if (activeConversation) {
      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `/api/conversations/${activeConversation}/messages`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error("Error fetching messages:", error);
          setMessages([]); // Set messages to an empty array if there's an error
        }
      };

      fetchMessages();
    }
  }, [activeConversation]);

  // Function to handle sending a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      sender: currentUserId, // Use the current user's ID
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    try {
      // Send the new message to the backend
      const response = await fetch(
        `/api/conversations/${activeConversation}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMsg),
        }
      );

      if (response.ok) {
        // If the message is successfully sent, update the messages state
        const updatedMessages = await response.json();
        setMessages(updatedMessages);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Function to switch the active conversation
  const handleConversationClick = (conversationId) => {
    setActiveConversation(conversationId);
  };

  // Function to create a new conversation
  const handleCreateConversation = async (userId, postAuthorId) => {
    const newConversation = await createConversation(userId, postAuthorId);
    if (newConversation) {
      setConversations([...conversations, newConversation]);
      setActiveConversation(newConversation._id); // Set the new conversation as active
    }
  };

  // Helper function to get the other participant's name
  const getOtherParticipantName = (participants) => {
    if (!Array.isArray(participants)) {
      return "Unknown User";
    }

    // Find the participant who is not the current user
    const otherParticipant = participants.find(
      (participant) => participant._id !== currentUserId
    );

    // Return the other participant's name or a fallback
    return otherParticipant ? otherParticipant.name : "Unknown User";
  };

  if (isLoading) {
    return <div>Loading conversations...</div>;
  }

  return (
    <div className="flex h-screen w-[85vw] bg-gray-50">
      {/* Messages Panel (Left Side) */}
      <div className="flex flex-col flex-1">
        {/* Chat Header */}
        <div className="text-center py-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold">
            {activeConversation
              ? `Chat with ${getOtherParticipantName(
                  conversations.find((c) => c._id === activeConversation)
                    ?.participants || []
                )}`
              : "Select a conversation"}
          </h2>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500">
              No messages yet. Start a conversation!
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id} // Use msg._id instead of msg.id
                className={`flex flex-col max-w-[60%] p-3 rounded-lg ${
                  msg.sender === currentUserId
                    ? "self-end bg-blue-500 text-white"
                    : "self-start bg-gray-100 text-black"
                }`}
              >
                <div className="text-sm">{msg.text}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        {activeConversation && (
          <div className="flex items-center p-4 border-t border-gray-200 bg-white">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send
            </button>
          </div>
        )}
      </div>

      {/* Conversation Panel (Right Side) */}
      <div className="w-1/4 border-l border-gray-200 bg-white overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Conversations</h2>
        </div>
        <div className="space-y-2 p-2">
          {conversations.map((conversation) => {
            // Get the other participant's name
            const otherParticipantName = getOtherParticipantName(
              conversation.participants
            );

            // Extract the last message (if it exists)
            const lastMessage =
              conversation.messages.length > 0
                ? conversation.messages[0].text // Use the latest message
                : "No messages yet";

            // Use `updatedAt` as the timestamp
            const timestamp = new Date(
              conversation.updatedAt
            ).toLocaleTimeString();

            return (
              <div
                key={conversation._id}
                onClick={() => handleConversationClick(conversation._id)}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  activeConversation === conversation._id ? "bg-blue-50" : ""
                }`}
              >
                <div className="font-semibold">{otherParticipantName}</div>
                <div className="text-sm text-gray-500">{lastMessage}</div>
                <div className="text-xs text-gray-400">{timestamp}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Messages;
