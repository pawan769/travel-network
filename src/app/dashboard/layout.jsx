"use client";
import React, { useState } from "react";
import LeftSideBar from "./LeftSideBar";
import { IoLocationOutline, IoMenuSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setMapToggle, setModalOpen } from "../redux/slices/slices";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import ModalExample from "./create/dialog";

const DashboardLayout = ({ children }) => {
  const [navToggle, setNavToggle] = useState(false);
  const modalOpen = useSelector((state) => state.app.modalOpen);
  const path = usePathname();
  const dispatch = useDispatch();

  const setModalOpenFunc = () => {
    dispatch(setModalOpen());
  };

  const menuClickHandler = () => {
    console.log(navToggle);
    setNavToggle((prev) => !prev);
  };

  return (
    <div className=" flex select-none   overflow-x-hidden">
      {/* Mobile Navbar */}
      <div className="z-30 fixed top-0 left-0 bg-gray-100 text-xl h-14 w-full px-3 font-bold flex gap-5 items-center justify-between pr-5 pl-4 cursor-pointer lg:hidden">
        <div className="flex items-center gap-4 h-10">
          <IoMenuSharp size={38} onClick={menuClickHandler} />
          <img src={"/images/logo.png"} width={80} height={60} alt="logo" />
        </div>
        {path === "/dashboard" && (
          <div>
            <Button
              variant="ghost"
              className="border-2 border-gray-300"
              onClick={() => dispatch(setMapToggle(true))}
            >
              <IoLocationOutline size={24} />
              <span>Map</span>
            </Button>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-[50vw]  lg:w-[15vw] h-screen md:bg-transparent transform transition-transform duration-300 z-30 ${
          navToggle ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <LeftSideBar
          setNavToggle={setNavToggle}
          menuClickHandler={menuClickHandler}
        />
      </div>

      {/* Main Content */}
      <div className="lg:ml-[15vw]">{children}</div>

      {modalOpen && <ModalExample open={modalOpen} />}

      <Toaster />
    </div>
  );
};

export default DashboardLayout;
