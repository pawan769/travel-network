"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Eye, House, MessageCircle, SquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { IoMenuSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setModalOpen } from "../redux/slices/slices";

const LeftSideBar = ({ setNavToggle, menuClickHandler }) => {
  const user = useSelector((state) => state.app.user);
  const dispatch = useDispatch();

  const router = useRouter();

  const { data: session, status } = useSession();

  const list = [
    { icon: <House />, name: "Home", path: "/" },
    { icon: <Eye />, name: "Explore", path: "explore" },
    { icon: <SquarePlus />, name: "Create", path: "create" },
    { icon: <MessageCircle />, name: "messages", path: "messages" },
    {
      icon: (
        <div
          className="cursor-pointer"
          onClick={() => itemClickHandler({ path: "profile" })}
        >
          <Image
            src={
              user.profilePic?.url
                ? user.profilePic.url
                : "/images/profilepic.jpg"
            }
            alt="PP"
            className="md:w-10 md:h-10 w-8 h-8 rounded-full"
            height={40}
            width={40}
            priority
          />
        </div>
      ),
      name: session ? session.user.name.split(" ")[0] : "Profile", // Extracts only the first name
      path: "profile",
    },
  ];

  const itemClickHandler = (elem) => {
    if (elem.path === "create") {
      dispatch(setModalOpen(true));
      setNavToggle(false);
    } else {
      setNavToggle(false);
      router.replace(`/dashboard/${elem.path}`);
    }
  };
  return (
    <div className=" h-screen sticky top-0 left-0 flex flex-col space-y-5 text-[3vw] max-w-[300px] md:text-[1.5vw] font-semibold overflow-hidden pt-7  bg-white">
      <div className="text-5xl md:text-[3vw] flex justify-between px-3 w-full overflow-hidden  items-center cursor-pointer  ">
        <div className="w-full h-full flex justify-center items-center">
          <Image
            src={"/images/logo.png"}
            width={120}
            height={100}
            alt="logo"
            priority
          />
        </div>
        <IoMenuSharp
          size={48}
          onClick={menuClickHandler}
          className="lg:hidden"
        />
      </div>
      <div className="flex flex-col gap-6 w-full ">
        {list.map((elem, index) => {
          return (
            <div
              key={index}
              className="flex gap-3 md:gap-5 items-center rounded-xl px-3 py-2 hover:bg-zinc-200 cursor-pointer "
              onClick={() => itemClickHandler(elem)}
            >
              <div className=" flex justify-center items-center size-10">
                <span>{elem.icon}</span>
              </div>
              <div className="capitalize">{elem.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeftSideBar;
