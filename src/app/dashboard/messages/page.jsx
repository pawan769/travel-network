"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeConversation, setActiveConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null); // Ref for scrolling to the bottom

  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  useEffect(() => {
    socketRef.current = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000",
      {
        reconnection: true,
      }
    );

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server on port 4000");
    });

    socketRef.current.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Join conversation room when activeConversation changes
  useEffect(() => {
    if (activeConversation && socketRef.current) {
      socketRef.current.emit("join", activeConversation);
      fetchMessages(activeConversation);
    }
  }, [activeConversation]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Triggered whenever messages update

  // Fetch all conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(`/api/conversations/${session?.user?.id}`);
        const data = await response.json();
        setConversations(Array.isArray(data) ? data : []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setConversations([]);
        setIsLoading(false);
      }
    };

    if (session?.user?.id) fetchConversations();
  }, [session?.user?.id]);

  const fetchMessages = async (conversationId) => {
    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/messages`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !activeConversation) return;

    const newMsg = {
      conversationId: activeConversation,
      sender: currentUserId,
      text: newMessage,
    };

    socketRef.current.emit("sendMessage", newMsg);
    setNewMessage("");
  };

  const handleConversationClick = (conversationId) => {
    setActiveConversation(conversationId);
  };

  const getOtherParticipantName = (participants) => {
    if (!Array.isArray(participants)) return "Unknown User";
    const otherParticipant = participants.find((p) => p._id !== currentUserId);
    return otherParticipant ? otherParticipant.name : "Unknown User";
  };

  if (isLoading) {
    return <div>Loading conversations...</div>;
  }

  return (
    <div className="flex h-screen w-[85vw] bg-gray-50">
      <div className="flex flex-col flex-1">
        <div className="text-center py-4 border-b border-gray-200 bg-white">
          <h2 className="text-4xl font-semibold">
            {activeConversation
              ? `Chat with ${getOtherParticipantName(
                  conversations.find((c) => c._id === activeConversation)
                    ?.participants || []
                )}`
              : "Select a conversation"}
          </h2>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500">
              No messages yet. Start a conversation!
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex flex-col max-w-[60%] p-3 rounded-lg ${
                    msg.sender === currentUserId
                      ? "self-end bg-black/90 text-white"
                      : "self-start bg-gray-100 text-black"
                  }`}
                >
                  <div className="text-sm">{msg.text}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(
                      msg.createdAt || msg.timestamp
                    ).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />{" "}
              {/* Invisible anchor for scrolling */}
            </>
          )}
        </div>
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
              className="ml-2 px-4 py-2 bg-black/80 text-white rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        )}
      </div>
      <div className="w-1/4 border-l border-gray-200 bg-white overflow-y-auto ">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold">Conversations</h2>
        </div>
        <div className="space-y-2 p-2">
          {conversations.map((conversation) => {
            const otherParticipantName = getOtherParticipantName(
              conversation.participants
            );
            const lastMessage =
              conversation.messages.length > 0
                ? conversation.messages[0].text
                : "No messages yet";
            const timestamp = new Date(
              conversation.updatedAt
            ).toLocaleTimeString();
            return (
              <div
                key={conversation._id}
                onClick={() => handleConversationClick(conversation._id)}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 border-2 border-black/20 ${
                  activeConversation === conversation._id ? "bg-blue-50" : ""
                }`}
              >
                <div className="font-semibold">{otherParticipantName}</div>

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
