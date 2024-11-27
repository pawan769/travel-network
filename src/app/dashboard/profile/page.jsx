"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const Profile = () => {
  const logoutHandler = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/signIn" });
  };
  return (
    <div>
      <Button className="mx-5" onClick={logoutHandler}>
        Logout
      </Button>
    </div>
  );
};
export default Profile;
