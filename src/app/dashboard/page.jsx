"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";

import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setRecommendedPosts, setUser } from "../redux/slices/slices";
import getUser from "../utils/getUser";
import Post from "./Post";
import getRecommendedPosts from "../utils/getRecommendedPosts";
import RightSideBar from "./rightSideBar";
import { Button } from "@/components/ui/button";
import axios from "axios";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = useSelector((state) => state.app.user);
  const recommendedPosts = useSelector((state) => state.app.recommendedPosts);

  const [isInitialized, setIsInitialized] = useState(false);
  const [visiblePostId, setVisiblePostId] = useState(null); // To track the currently visible post

  const postRefs = useRef([]);

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

    if (isInitialized && recommendedPosts.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Set the visible post ID when it enters the viewport
              const newId = entry.target.getAttribute("data-id");
              setVisiblePostId(newId);
            }
          });
        },
        { threshold: 1 } // Trigger when 100% of the post is visible
      );

      // Attach observer to all posts
      postRefs.current.forEach((ref) => {
        if (ref instanceof Element) {
          observer.observe(ref);
        }
      });

      return () => {
        // Cleanup observer on unmount
        postRefs.current.forEach((ref) => {
          if (ref) observer.unobserve(ref);
        });
      };
    }
  }, [session, isInitialized]);

  const userRecommendationHandler = async () => {
    console.log("clicked");
    try {
      const response = await axios.post(
        "./api/fetchRecommendations",
        { userId: session.user.id },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response);
      dispatch(setRecommendedPosts(response.data.posts));
    } catch (error) {
      console.log(error);
    }
  };

  // Display loading state until initialization is complete
  if (status === "loading" || !isInitialized) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={56} />
      </div>
    );
  }

  return (
    <>
      {user ? (
        <div className="w-full">
          {/* <div className="flex items-center justify-between ml-[22vw] md:ml-0 text-nowrap">
            {isInitialized && <p>Welcome, {user.name} to the Dashboard</p>}
          </div> */}
          <div className="ml-[22vw] md:ml-0">
            <Button
              type="button"
              variant="outline"
              onClick={userRecommendationHandler}
            >
              Get UserBased Recommendation
            </Button>
          </div>
          <div className=" flex gap-8 text-center mt-5">
            <div>
              {recommendedPosts.map((post, index) => (
                <div
                  key={index}
                  ref={(el) => (postRefs.current[index] = el)}
                  data-id={post?._id}
                  className="post-item mb-4"
                >
                  <Post post={post} recommendedPosts={recommendedPosts} />
                </div>
              ))}
            </div>
            <div className="border-red-400">
              <RightSideBar
                visiblePosts={recommendedPosts}
                highlightedPostId={visiblePostId}
              />
            </div>
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </>
  );
};

export default Dashboard;
