import Image from "next/image";
import { useState } from "react";
import { IoLocation } from "react-icons/io5";
import PostModal from "./PostModal";
const ProfilePost = ({ post }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const clickHandler = () => {
    setModalOpen(!modalOpen);
  };
  return (
    <div
      className="bg-gray-100 flex flex-col gap-2 p-1 h-[290px] border-2 border-gray-300 cursor-pointer rounded-md"
      onClick={clickHandler}
    >
      <div className="flex items-center gap-2">
        <IoLocation className="size-4" />
        <h2 className="w-[150px] text-nowrap overflow-hidden">
          {post.address}
        </h2>
      </div>
      <Image
        src={post.image.url}
        width={100}
        height={100}
        alt={post.caption}
        className="w-[200px] h-[200px] rounded-sm object-cover"
      />
      <div className="flex items-center justify-between px-1 font-semibold">
        <div>{post.likes.length != 0 ? post.likes.length : 0} Likes</div>
        <div>
          {post.comments.length != 0 ? post.comments.length : 0} Comments
        </div>
      </div>
      {modalOpen && (
        <PostModal open={modalOpen} setModalOpen={setModalOpen} post={post}/>
      ) }
    </div>
  );
};

export default ProfilePost;
