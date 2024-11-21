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
import { useSession } from "next-auth/react";
import addComment from "../utils/addComment";
import { useDispatch, useSelector } from "react-redux";
import { setRecommendedPosts } from "../redux/slices/slices";

const Post = ({ post }) => {
  const { data: session, status } = useSession();
  const [rating, setRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  const [showEdit, setShowEdit] = useState(false);
  const dispatch = useDispatch();
  const recommendedPosts = useSelector((state) => state.app.recommendedPosts);

  const handleRating = (value) => setRating(value);

  const handleCommentSubmit = async () => {
    if (newComment.trim() !== "") {
      try {
        const addedComment = await addComment(
          post._id,
          newComment,
          session.user.id
        );
        setNewComment("");
        if (addedComment) {
          const updatedRecommendedPosts = recommendedPosts.map((p) =>
            p._id === post._id
              ? {
                  ...p,
                  comments: [...p.comments, addedComment],
                }
              : p
          );
          console.log(updatedRecommendedPosts);

          dispatch(setRecommendedPosts(updatedRecommendedPosts));
        }
      } catch (error) {}
    }
  };

  return (
    <div className=" rounded-lg p-4 shadow-lg max-w-xl mx-auto my-2 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <Image
              src={
                "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600"
              }
              alt="Profile Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          </Avatar>
          <h3 className="font-semibold capitalize">{post?.author.name}</h3>
        </div>
        <DropdownMenu className="cursor-pointer">
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="p-2 focus-visible:ring-transparent"
            >
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
      <div className="mb-5">
        <Image
          src={post?.image.url}
          alt="Post Image"
          width={600}
          height={400}
          className="rounded-lg object-cover"
          priority
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
      <div className="flex items-center space-x-3 text-sm">
        <Avatar className="h-6 w-6">
          <Image
            src={
              "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600"
            }
            alt="Profile Avatar"
            width={20}
            height={20}
            className="rounded-full"
          />
        </Avatar>
        <h3 className="font-semibold capitalize">{post?.author.name}</h3>
        <p>{post?.caption}</p>
      </div>

      {/* Comments Section */}
      <div>
        <h4 className="font-semibold mb-2">Comments</h4>
        <div className="space-y-2">
          {post?.comments.map((data, index) => (
            <div
              key={index}
              className="border rounded p-2 bg-gray-100 text-sm flex gap-2"
            >
              <h3 className="font-semibold">{data.commenter.name}</h3>
              <p>{data.comment}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className=""
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
