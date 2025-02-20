"use client";

import { useEffect } from "react";
import CreatePost from "./page";
import { useDispatch } from "react-redux";
import { setModalOpen } from "@/app/redux/slices/slices";

const ModalExample = ({ open }) => {
  const dispatch = useDispatch();
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
        className=" top-0 left-0 bg-black/60 fixed inset-0 z-50 flex justify-center items-center overflow-hidden"
        onClick={() => dispatch(setModalOpen(false))}
      ></div>

      <CreatePost setModalOpen={setModalOpen} />
    </>
  );
};
export default ModalExample;
