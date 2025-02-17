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
import Post from "./Post.jsx";
import RightSideBar from "./RightSideBar";
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
  const [error, setError] = useState(null); // To handle errors

  const postRefs = useRef([]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const initializeData = async () => {
        try {
          // Fetch user details
          const userDetails = await getUser(session.user.id);
          if (userDetails) {
            dispatch(setUser(userDetails)); // Dispatch user data to Redux
          }

          // Fetch recommended posts
          const recommendedPosts = await fetchRecommendations(session.user.id);
          if (recommendedPosts) {
            dispatch(setRecommendedPosts(recommendedPosts)); // Dispatch recommended posts to Redux
          }

          // Mark initialization as complete
          setIsInitialized(true);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          setError("Failed to fetch data. Please try again later.");
        }
      };

      initializeData(); // Fetch and set data
    }
  }, [session, status, dispatch]);

  useEffect(() => {
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
  }, [isInitialized, recommendedPosts]);

  // Display loading state until initialization is complete
  if (status === "loading" || !isInitialized) {
    return (
      <div className="w-[80vw] h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={56} />
      </div>
    );
  }

  // Display error state if initialization fails
  if (error) {
    return (
      <div className="w-[80vw] h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <div className="w-full">
          <div className="flex space-x-3 text-center mt-12 md:mt-5 justify-center ml-2 md:ml-0">
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
              className={`fixed z-20 right-0 md:bottom-2 md:right-0 ${
                mapToggle ? "bottom-0" : "-bottom-[80vh]"
              } transition-[bottom] duration-300 w-screen h-[70vh]  pt-1 md:px-0 md:pt-0 md:pr-1 md:w-[43vw] md:h-[95vh] bg-gray-100 md:bg-transparent`}
            >
              <div className="mb-2 flex  justify-end px-6 md:hidden">
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
