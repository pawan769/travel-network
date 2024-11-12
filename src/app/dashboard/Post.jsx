"use client";

import { useState } from "react";
import { MoreVertical, Edit2, Trash2, Star } from "lucide-react";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Post = ({ post }) => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  const handleRating = (value) => setRating(value);

  const handleCommentSubmit = () => {
    if (newComment.trim() !== "") {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-lg max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <Image
              src={post?.avatar}
              alt="Profile Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          </Avatar>
          <h3 className="font-semibold">{post?.username}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-2">
              <MoreVertical size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => alert("Option 1")}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Option 2")}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Post Image */}
      <div className="mb-4">
        <Image
          src={post?.image}
          alt="Post Image"
          width={600}
          height={400}
          className="rounded-lg object-cover"
        />
      </div>

      {/* Review System */}
      <div className="flex space-x-2 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={24}
            className={`cursor-pointer ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => handleRating(i + 1)}
          />
        ))}
      </div>

      {/* Comments Section */}
      <div>
        <h4 className="font-semibold mb-2">Comments</h4>
        <div className="space-y-2">
          {comments?.map((comment, index) => (
            <div key={index} className="border rounded p-2 bg-gray-100 text-sm">
              {}
            </div>
          ))}
        </div>

        <div className="mt-3 flex space-x-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow"
          />
          <Button
            onClick={handleCommentSubmit}
            className="bg-blue-500 text-white"
          >
            Comment
          </Button>
        </div>
      </div>

      {/* Post Edit Button */}
      {showEdit && (
        <Button className="mt-4 w-full bg-green-500 text-white">
          Save Changes
        </Button>
      )}
    </div>
  );
};

export default Post;
