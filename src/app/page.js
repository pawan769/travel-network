"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import  { useEffect } from "react";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("./auth/signIn");
    } else if (status === "authenticated") {
      router.push("../dashboard");
    }
  }, [status, router]);
};

export default Dashboard;
