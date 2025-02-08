"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMapToggle,
  setRecommendedPosts,
  setUser,
} from "../redux/slices/slices";
import getUser from "../utils/getUser";
import Post from "./Post";
import RightSideBar from "./rightSideBar";
import fetchRecommendations from "../utils/fetchRecommendations";
import { IoClose } from "react-icons/io5";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const user = useSelector((state) => state.app.user);
  const mapToggle = useSelector((state) => state.app.mapToggle);
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

          const recommendedPosts = await fetchRecommendations(session.user.id);
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

  // Display loading state until initialization is complete
  if (status === "loading" || !isInitialized) {
    return (
      <div className="w-[80vw] h-screen flex items-center justify-center ">
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

          <div className=" flex gap-8 text-center mt-12 md:mt-5 justify-center ml-2 md:ml-0">
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
            <div
              className={`fixed z-40  top-0 md:top-7 md:right-0 ${
                mapToggle ? "right-0" : "-right-[80vw]"
              } transition-[right] duration-300 w-[70vw] h-screen px-2 pt-1 md:px-0 md:pt-0 md:pr-1  md:w-[43vw] md:h-[95vh] bg-gray-100 md:bg-transparent `}
            >
              <div className="mb-4 flex justify-end px-6 md:hidden">
                <IoClose
                  size={32}
                  onClick={() => dispatch(setMapToggle(false))}
                />
              </div>
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
