"use client";
import React, { useState } from "react";
import LeftSideBar from "./LeftSideBar";
import { Toaster } from "@/components/ui/toaster";
import { IoLocationOutline, IoMenuSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setMapToggle } from "../redux/slices/slices";

const DashboardLayout = ({ children }) => {
  const [navToggle, setNavToggle] = useState(false);
  const dispatch = useDispatch();
  const menuClickHandler = () => {
    setNavToggle(navToggle ? false : true);
  };
  return (
    <div className="flex select-none">
      <div
        className={` fixed top-0 left-0 bg-gray-200 text-xl h-14 w-full min-w-32 px-3 font-bold flex gap-5 items-center justify-between pr-5 pl-4 cursor-pointer md:hidden z-30`}
      >
        <div className="flex items-center  gap-4 h-10">
          <IoMenuSharp size={38} onClick={menuClickHandler} />
          <div className="text-3xl font-semibold">LOGO</div>
        </div>
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
      </div>

      <div
        className={`w-[30vw] md:w-[15vw] h-screen md:block top-0  transition-[left] duration-300 z-30 ${
          navToggle
            ? "left-0  bg-white md:bg-transparent"
            : "-left-[400px]  md:left-0  "
        } fixed`}
      >
        <LeftSideBar
          setNavToggle={setNavToggle}
          menuClickHandler={menuClickHandler}
        />
      </div>

      <div className=" ml-2 md:ml-[15vw] ">{children}</div>

      <Toaster />
    </div>
  );
};

export default DashboardLayout;
