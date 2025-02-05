"use client";
import React, { useState } from "react";
import LeftSideBar from "./LeftSideBar";
import { Toaster } from "@/components/ui/toaster";
import { IoMenuSharp } from "react-icons/io5";

const DashboardLayout = ({ children }) => {
  const [navToggle, setNavToggle] = useState(true);
  const menuClickHandler = () => {
    setNavToggle(navToggle ? false : true);
  };
  return (
    <div className="flex select-none">
      <div
        className={` fixed top-0  left-0 bg-white ${
          navToggle ? "" : "hidden"
        } text-xl h-16 w-[20vw] min-w-32 px-3 font-bold flex items-center justify-between cursor-pointer md:hidden`}
      >
        <IoMenuSharp size={38} onClick={menuClickHandler} />
        <span>LOGO</span>
      </div>

      <div
        className={`w-[30vw] md:w-[15vw] h-screen md:block top-0  transition-[left] duration-300 z-30 ${
          !navToggle
            ? "left-0  bg-white md:bg-transparent"
            : "-left-[400px]  md:left-0  "
        } fixed`}
      >
        <LeftSideBar
          setNavToggle={setNavToggle}
          menuClickHandler={menuClickHandler}
        />
      </div>

      <div className=" ml-2 md:ml-[15vw]">{children}</div>

      <Toaster />
    </div>
  );
};

export default DashboardLayout;
