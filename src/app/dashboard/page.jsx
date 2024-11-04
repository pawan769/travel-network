"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("./auth/signIn");
    }
  }, [status, router]);

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
      {`Welcome ${session ? session.user.name : null} to the Dashboard`}
      <Button className="mx-5" onClick={logoutHandler}>
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;
