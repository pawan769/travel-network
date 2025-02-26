"use client";

import { useState } from "react";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { FaArrowLeft, FaArrowRight, FaHeart, FaRegHeart } from "react-icons/fa";
import { BiCommentDetail } from "react-icons/bi";

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
import { IoLocation } from "react-icons/io5";
import { useEffect } from "react";

const Post = ({ post }) => {
  const { data: session, status } = useSession();
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showEdit, setShowEdit] = useState(false);
  const dispatch = useDispatch();
  const recommendedPosts = useSelector((state) => state.app.recommendedPosts);

  useEffect(() => {
    if (post.images && post.images.length > 0) {
      setCurrentImageIndex(0); // Reset to the first image if available
    }
  }, [post]);

  const handleCommentSubmit = async () => {
    setCommentLoading(true);
    if (newComment.trim() === "") {
      setCommentLoading(false);
      return 0;
    }

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

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="rounded-lg p-4 shadow-lg w-fit space-y-1  lg:w-fit  mx-auto my-2 min-h-[60vh] border-2 border-zinc-300 bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center w-[60vw] min-w-[350px] md:min-w-[200px]  lg:max-w-[25vw] mx-auto ">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8  md:z-20  flex items-center justify-center -z-20 ">
            <Image
              src={
                post.author.profilePic?.url
                  ? post.author.profilePic.url
                  : "/images/profilepic.jpg"
              }
              alt="Profile Avatar"
              width={20}
              height={20}
              className="rounded-full size-8 "
              priority
            />
          </Avatar>
          <h3 className="font-semibold capitalize">{post?.author.name}</h3>
        </div>
        <DropdownMenu className="cursor-pointer bg-blue-400">
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
            <DropdownMenuItem
              onClick={deletePostHandler}
              className={`${
                session.user.id === post.author._id ? "" : "hidden"
              }`}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center  justify-start gap-2 w-[60vw] mx-auto min-w-[350px] md:min-w-[200px]  lg:max-w-[25vw] mb-2 text-md">
        <div className=" h-full">
          <IoLocation className="size-4  " />
        </div>
        <h2 className="h-full text-nowrap overflow-hidden capitalize text-left ">
          {post.address}
        </h2>
      </div>

      {/* Image Carousel */}
      <div className="mb-3 h-fit  w-fit mx-auto max-h-[350px] flex items-center justify-center relative bg-black/10">
        {post.images && post.images.length > 0 ? (
          <>
            {/* Display Current Image */}
            <Image
              src={post.images[currentImageIndex].url}
              alt="Post Image"
              width={300}
              height={300}
              className="rounded-lg object-contain h-[60vh] w-[60vw] min-w-[350px] max-h-[350px] md:min-w-[200px] lg:max-w-[25vw] "
              priority
            />

            {/* Show Left Arrow if there are previous images */}
            {currentImageIndex > 0 && (
              <button
                className="absolute top-1/2 -left-2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
                onClick={handlePrevImage}
              >
                <FaArrowLeft />
              </button>
            )}

            {/* Show Right Arrow if there are more images */}
            {currentImageIndex < post.images.length - 1 && (
              <button
                className="absolute top-1/2 -right-2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
                onClick={handleNextImage}
              >
                <FaArrowRight />
              </button>
            )}
          </>
        ) : (
          <div className="text-center">No images available</div>
        )}
      </div>

      {/* Review System */}
      <div className="flex  mb-4 items-center px-3 py-2 justify-between w-[60vw] md:min-w-[200px] min-w-[350px]  lg:max-w-[25vw] mx-auto ">
        <div className="flex space-x-2 items-center">
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

        <div className="flex items-center space-x-2 text-md font-semibold">
          <BiCommentDetail size={20} />

          <div>{`${post.comments.length} comments`}</div>
        </div>
      </div>

      {/* Post Caption and Comments Section */}
      {/* <div className="flex flex-col justify-between w-[55%] "> */}
      {/* <div>
          <div className="flex items-top space-x-3 text-sm px-2">
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

            <div className="max-w-[80%] text-left break-words mb-2 font-semibold">
              {post?.caption}
            </div>
          </div>
          <div className="text-left pl-3 break-words overflow-auto max-h-20 w-full text-sm">
            {post?.description}
          </div>
        </div> */}

      {/* Comments Section */}
      <div className="max-h-[70%] flex flex-col justify-between pb-2 px-1  w-fit  mx-auto">
        {/* <h4 className="font-semibold mb-2 mx-auto">Comments</h4> */}

        {/* {post.comments.length != 0 && (
          <div className="space-y-2 max-h-[50%] overflow-auto w-[60vw] min-w-[350px] md:min-w-[200px]  lg:max-w-[25vw] mx-auto">
            <div className="  text-sm flex gap-2 rounded-full pl-5">
              <h3 className="font-semibold capitalize">
                {post.comments[post.comments.length - 1].commenter.name}
              </h3>
              <p>{post?.comments[post.comments.length - 1].comment}</p>
            </div>
          </div>
        )} */}

        <div className="mt-2  flex gap-2 border-2 border-black/20 w-[60vw] min-w-[350px] md:min-w-[200px]  lg:max-w-[25vw] rounded-full px-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="focus-visible:ring-transparent border-none"
          />

          <Button
            onClick={handleCommentSubmit}
            className="text-blue text-xs px-2 w-16 mx-auto "
            variant="ghost"
          >
            {commentLoading ? (
              <Loader2 className="animate-spin size-5 w-10" />
            ) : (
              <p>Comment</p>
            )}
          </Button>
        </div>
      </div>
      {/* </div> */}

      {/* Post Edit Button */}
      {showEdit && (
        <Button className="mt-4 w-full  text-white">Save Changes</Button>
      )}
    </div>
  );
};

export default Post;
