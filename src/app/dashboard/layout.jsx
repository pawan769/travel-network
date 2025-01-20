"use client";
import React, { useState } from "react";
import LeftSideBar from "./LeftSideBar";
import { Toaster } from "@/components/ui/toaster";
import { IoMenuSharp, IoCloseSharp } from "react-icons/io5";

const DashboardLayout = ({ children }) => {
  const [navToggle, setNavToggle] = useState(true);
  const menuClickHandler = () => {
    setNavToggle(navToggle ? false : true);
  };
  return (
    <div className="grid grid-cols-7 h-screen w-screen overflow-x-hidden">
      <div className="col-start-1 col-span-1  h-full hidden md:block">
        <LeftSideBar setNavToggle={setNavToggle} />
      </div>
      <div className="col-start-1 col-span-1  flex justify-center pt-9 md:hidden">
        {navToggle ? (
          <IoMenuSharp size={24} onClick={menuClickHandler} />
        ) : (
          <div className="top-0 left-0 fixed z-10000 h-full bg-black text-white overflow-hidden ">
            <div className="flex items-center justify-end px-3 pt-3  ">
              <IoCloseSharp size={24} onClick={menuClickHandler} className="" />
            </div>
            <div>
              <LeftSideBar setNavToggle={setNavToggle} />
            </div>
          </div>
        )}
      </div>

      <div className="col-span-6 col-start-2 flex">{children}</div>

      <Toaster />
    </div>
  );
};

export default DashboardLayout;
