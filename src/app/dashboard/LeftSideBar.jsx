"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  Bell,
  Eye,
  House,
  MessageSquare,
  Search,
  SquarePlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ModalExample from "./create/dialog";
import { IoMenuSharp } from "react-icons/io5";

const LeftSideBar = ({ setNavToggle, menuClickHandler }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  const { data: session, status } = useSession();

  const list = [
    { icon: <House />, name: "Home", path: "/" },
    { icon: <Search />, name: "Search", path: "search" },
    // { icon: <Eye />, name: "Explore", path: "explore" },
    // { icon: <MessageSquare />, name: "Messages", path: "messages" },
    // { icon: <Bell />, name: "Notifications", path: "notifications" },
    { icon: <SquarePlus />, name: "Create", path: "create" },
    {
      icon: (
        <div
          className="cursor-pointer"
          onClick={() => itemClickHandler({ path: "profile" })}
        >
          <Image
            src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="PP"
            className="md:w-10 md:h-10 w-8 h-8 rounded-full"
            height={10}
            width={10}
          />
        </div>
      ),
      name: `${
        session
          ? session.user.name.charAt(0).toUpperCase() +
            session.user.name.slice(1)
          : "Profile"
      }`,
      path: "profile",
    },
  ];

  const itemClickHandler = (elem) => {
    if (elem.path === "create") {
      // setNavToggle(true); //caused error on opening model
      setModalOpen(true);
    } else {
      router.replace(`/dashboard/${elem.path}`);
      setNavToggle(true);
    }
  };
  return (
    <div className="w-[30vw] md:w-[15vw] h-screen flex flex-col gap-5 text-[2.8vw] md:text-[1.3vw] font-semibold overflow-hidden pt-7 ">
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
              className="flex gap-3 md:gap-5 items-center  rounded-xl px-3 py-2 hover:bg-zinc-200 cursor-pointer "
              onClick={() => itemClickHandler(elem)}
            >
              <div className=" flex justify-center items-center md:size-10 size-5 ">
                <span>{elem.icon}</span>
              </div>
              <div className="">{elem.name}</div>
            </div>
          );
        })}
      </div>
      {console.log(isModalOpen)}

      {isModalOpen && (
        <ModalExample open={isModalOpen} setModalOpen={setModalOpen} />
      )}
    </div>
  );
};

export default LeftSideBar;
