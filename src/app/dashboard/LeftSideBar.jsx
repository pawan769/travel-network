"use client";
import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  Bell,
  Eye,
  House,
  MessageSquare,
  Search,
  Slack,
  SquarePlus,
  UserRoundPen,
} from "lucide-react";
import { useRouter } from "next/navigation";

const LeftSideBar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const list = [
    { icon: <House />, name: "Home", path: "../" },
    { icon: <Search />, name: "Search", path: "search" },
    { icon: <Eye />, name: "Explore", path: "explore" },
    { icon: <MessageSquare />, name: "Messages", path: "messages" },
    { icon: <Bell />, name: "Notifications", path: "notifications" },
    { icon: <SquarePlus />, name: "Create", path: "create" },
  ];

  const itemClickHandler = (elem) => {
    router.push(`./dashboard/${elem.path}`);
  };
  return (
    <div className="  flex flex-col gap-5  text-xl font-semibold border-2 px-3 pt-7 ">
      <div className="text-3xl  px-5 py-2 w-fit  cursor-pointer">LOGO</div>
      {list.map((elem, index) => {
        return (
          <div
            key={index}
            className="flex gap-3 items-center ml-3 rounded-xl px-2 py-3 hover:bg-zinc-200 cursor-pointer"
            onClick={() => itemClickHandler(elem)}
          >
            <div>{elem.icon}</div>
            <div>{elem.name}</div>
          </div>
        );
      })}
      <div className="flex gap-3 px-4 items-center w-fit mt-2 capitalize cursor-pointer">
        <img
          src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="PP"
          className="w-10 h-10 rounded-full"
        />
        {session ? session.user.name : null}
      </div>
    </div>
  );
};

export default LeftSideBar;
