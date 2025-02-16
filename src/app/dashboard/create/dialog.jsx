"use client";

import { useEffect } from "react";
import CreatePost from "./page";

const ModalExample = ({ open, setModalOpen }) => {
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
    <>
      <div
        className="h-screen w-screen top-0 left-0 bg-[#000000b7] fixed z-40 flex justify-center items-center overflow-hidden"
        onClick={() => setModalOpen(false)}
      ></div>

      <CreatePost setModalOpen={setModalOpen} />
    </>
  );
};
export default ModalExample;
