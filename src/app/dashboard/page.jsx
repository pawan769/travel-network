"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/slices";
import getUser from "../utils/getUser";
import Post from "./Post";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = useSelector((state) => state.app.user);

  useEffect(() => {
    // Ensure the session is available before attempting to fetch user data
    if (session?.user?.id) {
      const fetchUser = async () => {
        try {
          const userDetails = await getUser(session.user.id);
          if (userDetails) {
            dispatch(setUser(userDetails)); // Dispatch user data to Redux
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      };

      fetchUser(); // Fetch user data once session is available
    }
  }, [session, dispatch]); // Run effect when session or dispatch changes

  // Loading state
  if (status === "loading") {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={56} />
      </div>
    );
  }

  // Logout handler
  const logoutHandler = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/signIn" });
  };

  return (
    <>
      {user ? (
        <div className=" w-full">
          <div className="flex items-center justify-between">
            <p>Welcome, {user.name} to the Dashboard</p>
            <Button className="mx-5" onClick={logoutHandler}>
              Logout
            </Button>
          </div>
          <div className="grid grid-cols-6 text-center">
            <div className="col-span-3 "><Post/><Post/><Post/><Post/><Post/><Post/></div>
            <div className="col-span-3  ">rightSideHome</div>
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </>
  );
};

export default Dashboard;
