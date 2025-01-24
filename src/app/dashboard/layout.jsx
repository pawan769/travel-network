"use client";
import React, { useState } from "react";
import LeftSideBar from "./LeftSideBar";
import { Toaster } from "@/components/ui/toaster";
import { IoMenuSharp, IoCloseSharp } from "react-icons/io5";

const DashboardLayout = ({ children }) => {
  const [navToggle, setNavToggle] = useState(false);
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
        className={`w-[30vw] h-screen  md:block top-0 left-0 transition-[left] ${
          !navToggle
            ? "left-0 bg-white md:bg-transparent"
            : "-left-[35vw] md:left-0 "
        } fixed`}
      >
        <LeftSideBar
          setNavToggle={setNavToggle}
          menuClickHandler={menuClickHandler}
        />
      </div>
      <div className=" flex justify-center items-center mt-16 mx-auto w-[12vw] h-14 fixed md:hidden ">
        {/* {navToggle ? (
          <IoMenuSharp size={38} onClick={menuClickHandler} />
        ) : (
          <div
            className={`top-0 fixed z-10000 h-full w-[40vw] bg-[#343534] text-white ${
              !navToggle ? "left-0" : "-left-[250px]"
            }`}
          >
            <div className="flex items-center justify-end px-3 pt-3  ">
              <IoCloseSharp size={24} onClick={menuClickHandler} className="" />
            </div>
            <div>
              <LeftSideBar setNavToggle={setNavToggle} />
            </div>
          </div>
        )} */}
      </div>

      <div className=" ml-2 md:ml-[15vw]">{children}</div>

      <Toaster />
    </div>
  );
};

export default DashboardLayout;
