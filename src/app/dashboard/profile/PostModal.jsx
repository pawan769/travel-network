"use client";

import { useEffect } from "react";

import Post from "../Post";

const PostModal = ({ open, setModalOpen, post }) => {
  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup to ensure scrolling is re-enabled when the component unmounts
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  if (!open) return null; // Render nothing if the modal is not open

  return (
    <div
      className="h-[100vh] w-[100vw] top-0 left-0 right-0 bottom-0 bg-[#000000b7] fixed z-20 flex justify-center items-center overflow-hidden"
      onClick={() => setModalOpen(false)}
    >
      <div className=" absolute top-[50vh] left-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl z-30 ">
        <Post post={post} />
      </div>
    </div>
  );
};
export default PostModal;
