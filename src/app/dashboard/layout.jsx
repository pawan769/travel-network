import React from "react";
import LeftSideBar from "./LeftSideBar";
import { Toaster } from "@/components/ui/toaster";

const DashboardLayout = ({ children }) => {
  return (
    <div className="grid grid-cols-7 h-screen w-screen overflow-x-hidden">
      <div className="col-span-2 fixed top-0 left-0 h-full ">
        <LeftSideBar className="overflow-hidden" />
      </div>

      <div className="col-span-6 col-start-2 flex">{children}</div>

      <Toaster />
    </div>
  );
};

export default DashboardLayout;
