"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Eye, House, SquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import ModalExample from "./create/dialog";
import { IoMenuSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";

const LeftSideBar = ({ setNavToggle, menuClickHandler }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const user = useSelector((state) => state.app.user);

  const router = useRouter();

  const { data: session, status } = useSession();

  const list = [
    { icon: <House />, name: "Home", path: "/" },
    { icon: <Eye />, name: "Explore", path: "#explore" },
    { icon: <SquarePlus />, name: "Create", path: "create" },
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
      setModalOpen(true);
    } else {
      router.replace(`/dashboard/${elem.path}`);
      setNavToggle(true);
    }
  };
  return (
    <div className="w-[30vw] md:w-[15vw] h-screen flex flex-col gap-5 text-[2.8vw] md:text-[1.3vw] font-semibold overflow-hidden pt-7 z-30 ">
      <div className="text-[6vw] md:text-[3vw] flex justify-between px-3 items-center   cursor-pointer  ">
        <span>LOGO</span>
        <IoMenuSharp
          size={38}
          onClick={menuClickHandler}
          className="md:hidden"
        />
      </div>
      <div className="flex flex-col gap-6 ">
        {list.map((elem, index) => {
          return (
            <div
              key={index}
              className="flex gap-3 md:gap-5 items-center rounded-xl px-3 py-2 hover:bg-zinc-200 cursor-pointer "
              onClick={() => itemClickHandler(elem)}
            >
              <div className=" flex justify-center items-center md:size-10">
                <span>{elem.icon}</span>
              </div>
              <div className="capitalize">{elem.name}</div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <ModalExample open={isModalOpen} setModalOpen={setModalOpen} />
      )}
    </div>
  );
};

export default LeftSideBar;
