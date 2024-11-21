"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setRecommendedPosts, setUser } from "../redux/slices/slices";
import getUser from "../utils/getUser";
import Post from "./Post";
import getRecommendedPosts from "../utils/getRecommendedPosts";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = useSelector((state) => state.app.user);
  const recommendedPosts = useSelector((state) => state.app.recommendedPosts);

  // Local state to track initialization completion
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      const initializeData = async () => {
        try {
          const userDetails = await getUser(session.user.id);
          if (userDetails) {
            dispatch(setUser(userDetails)); // Dispatch user data to Redux
          }

          const recommendedPosts = await getRecommendedPosts(session.user.id);
          if (recommendedPosts) {
            dispatch(setRecommendedPosts(recommendedPosts)); // Dispatch recommended posts to Redux
          }

          // Mark initialization as complete
          setIsInitialized(true);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      };

      initializeData(); // Fetch and set data
    }
  }, [session, dispatch]);

  // Display loading state until initialization is complete
  if (status === "loading" || !isInitialized) {
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
            {!isInitialized && <p>Welcome, {user.name} to the Dashboard</p>}
            <Button className="mx-5" onClick={logoutHandler}>
              Logout
            </Button>
          </div>
          <div className="grid grid-cols-6 text-center">
            <div className="col-span-3 ">
              {recommendedPosts.map((post, index) => (
                <Post
                  key={index}
                  post={post}
                  recommendedPosts={recommendedPosts}
                />
              ))}
            </div>
            <div className="col-span-3">rightSideHome</div>
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </>
  );
};

export default Dashboard;
