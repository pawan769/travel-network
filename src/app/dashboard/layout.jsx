import React from "react";
import LeftSideBar from "./LeftSideBar";
import { Toaster } from "@/components/ui/toaster";

const DashboardLayout = ({ children }) => {
  return (
    <div className="grid grid-cols-7 h-screen w-screen grow">
      <LeftSideBar className="col-span-2" />
      <div className="col-span-6 flex mt-16 justify-center">{children}</div>
      <Toaster />
    </div>
  );
};

export default DashboardLayout;
