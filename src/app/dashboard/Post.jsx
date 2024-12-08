"use client";

import { useState } from "react";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import setLike from "../utils/setLike";
import { Loader2 } from "lucide-react";
import deletePost from "../utils/deletePost";

const Post = ({ post }) => {
  const { data: session, status } = useSession();
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const dispatch = useDispatch();
  const recommendedPosts = useSelector((state) => state.app.recommendedPosts);

  const handleCommentSubmit = async () => {
    setCommentLoading(true);
    if (newComment.trim() !== "") {
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

        dispatch(setRecommendedPosts(updatedRecommendedPosts));
        setCommentLoading(false);
      }
    }
  };

  //like handler

  const likeClickHandler = () => {
    if (!post.likes.includes(session.user.id)) {
      const updatedRecommendedPosts = recommendedPosts.map((p) =>
        p._id === post._id
          ? {
              ...p,
              likes: [...p.likes, session.user.id],
            }
          : p
      );

      setLike(session.user.id, post._id);
      dispatch(setRecommendedPosts(updatedRecommendedPosts));
    }
    if (post.likes.includes(session.user.id)) {
      const updatedRecommendedPosts = recommendedPosts.map((p) =>
        p._id === post._id
          ? {
              ...p,
              likes: p.likes.filter((id) => id !== session.user.id),
            }
          : p
      );
      setLike(session.user.id, post._id);
      dispatch(setRecommendedPosts(updatedRecommendedPosts));
    }
  };

  const deletePostHandler = () => {
    if (post.author._id === session.user.id) {
      const updatedRecommendedPosts = recommendedPosts.filter(
        (p) => p._id !== post._id
      );

      deletePost(post._id, session.user.id);
      dispatch(setRecommendedPosts(updatedRecommendedPosts));
    }
  };

  return (
    <div className=" rounded-lg p-4 shadow-lg max-w-xl mx-auto my-2 h-[60vh] border-2 border-zinc-300 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 ">
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
            <DropdownMenuItem onClick={deletePostHandler}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className=" flex h-[85%] gap-1 ">
        <div className=" flex flex-col w-[45%] ">
          {/* Post Image */}
          <div className="mb-3  h-[87%] w-full">
            <Image
              src={post?.image.url}
              alt="Post Image"
              width={300}
              height={300}
              className="rounded-lg object-cover h-[100%] w-[100%]"
              priority
            />
          </div>

          {/* Review System */}
          <div className="flex gap-2 mb-4 items-center ">
            {post.likes.includes(session?.user.id) ? (
              <FaHeart
                onClick={likeClickHandler}
                className="text-red-600 size-5 cursor-pointer"
              />
            ) : (
              <FaRegHeart
                className="cursor-pointer size-5 "
                onClick={likeClickHandler}
              />
            )}
            <div className="font-semibold">{`${
              post ? post.likes.length : 0
            } Likes`}</div>
          </div>
        </div>
        <div className="flex flex-col justify-between  w-[55%] ">
          <div className="flex items-top space-x-3 text-sm  h-[20%] px-2">
            <Avatar className="h-6 w-6">
              <Image
                src={
                  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600"
                }
                alt="Profile Avatar"
                width={30}
                height={30}
                className="rounded-full"
              />
            </Avatar>

            <p className="max-w-[80%] text-left break-words mb-2">
              {post?.caption}
            </p>
          </div>

          {/* Comments Section */}
          <div className="max-h-[80%] flex flex-col justify-between pb-2  px-1">
            <h4 className="font-semibold mb-2 ">Comments</h4>
            <div className="space-y-2 h-[60%] overflow-hidden">
              {post?.comments.map((data, index) => (
                <div
                  key={index}
                  className="border rounded p-2 bg-gray-100 text-sm flex gap-2"
                >
                  <h3 className="font-semibold capitalize">
                    {data.commenter.name}
                  </h3>
                  <p>{data.comment}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="focus-visible:ring-transparent"
              />

              <Button
                onClick={handleCommentSubmit}
                className="bg-blue-500 text-white text-xs px-2"
              >
                {commentLoading ? (
                  <Loader2 className="animate-spin size-5 w-10" />
                ) : (
                  <p>Comment</p>
                )}
              </Button>
            </div>
          </div>
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
