import React from "react";
import LeftSideBar from "./LeftSideBar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="grid grid-cols-6 h-screen w-screen grow">
      <LeftSideBar  />
      <div className="col-span-3 flex items-center justify-center">{children}</div>
    </div>
  );
};

export default DashboardLayout;
