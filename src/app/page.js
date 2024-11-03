"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("./auth/signIn");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const logoutHandler = async () => {
    console.log("logout clicked");
    await signOut({ redirect: true, callbackUrl: "/auth/signIn" }); // Redirect to home after logout
  };
  return (
    <div>
      {`Welcome ${session.user.name} to the Dashboard`}
      <Button className="mx-5" onClick={logoutHandler}>
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;
