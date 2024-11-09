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

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();

  const router = useRouter();

  const user = useSelector((state) => state.app.user);
  console.log(user);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("./auth/signIn");
    }
  
    if (status === "authenticated") {
      const fetchUser = async () => {
        try {
          const userDetails = await getUser(session.user.id);
          // Dispatch to Redux or set state only if user data is valid
          if (userDetails) {
            dispatch(setUser(userDetails));
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      };
  
      fetchUser(); // Call async function
    }
  }, );
  

  

  if (status === "loading") {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={56} />;
      </div>
    );
  }

  const logoutHandler = async () => {
    console.log("logout clicked");
    await signOut({ redirect: true, callbackUrl: "/auth/signIn" }); // Redirect to home after logout
  };
  return (
    <div>
      {`Welcome ${user.name } to the Dashboard`}
      <Button className="mx-5" onClick={logoutHandler}>
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;
