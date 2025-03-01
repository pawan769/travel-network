"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setItemUserMatrix,
  setMapToggle,
  setRecommendedPosts,
  setRecommendedScores,
  setSimilarityMatrix,
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
  const [visiblePostId, setVisiblePostId] = useState(null);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const postRefs = useRef([]);

  //  Get User Location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const successHandler = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setError(null);
    };

    const errorHandler = (err) => {
      setError(`Error getting location: ${err.message}`);
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
  }, []);

  // Fetch User Data & Recommendations (after Location is Available)
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id && location) {
      const initializeData = async () => {
        try {
          // Fetch user details
          const userDetails = await getUser(session.user.id);
          if (userDetails) dispatch(setUser(userDetails));

          // Fetch recommended posts (Pass location)
          if (location) {
            const recommendedPosts = await fetchRecommendations({
              userId: session.user.id,
              latitude: location.latitude,
              longitude: location.longitude,
            });
            if (recommendedPosts) {
              dispatch(setRecommendedPosts(recommendedPosts.posts));
              dispatch(setItemUserMatrix(recommendedPosts.itemUserMatrix));
              dispatch(
                setRecommendedScores(recommendedPosts.recommendedScores)
              );
              dispatch(setSimilarityMatrix(recommendedPosts.similarityMatrix));
            }

            setIsInitialized(true);
          }
        } catch (error) {
          console.error("Failed to fetch data:", error);
          setError("Failed to fetch data. Please try again later.");
        }
      };

      initializeData();
    }
  }, [session, status, dispatch, location]); // ✅ ADDED `location` AS DEPENDENCY

  //  Visibility Observer for Posts
  useEffect(() => {
    if (isInitialized && recommendedPosts.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisiblePostId(entry.target.getAttribute("data-id"));
            }
          });
        },
        { threshold: 1 }
      );

      postRefs.current.forEach((ref) => {
        if (ref instanceof Element) observer.observe(ref);
      });

      return () => {
        postRefs.current.forEach((ref) => {
          if (ref) observer.unobserve(ref);
        });
      };
    }
  }, [isInitialized, recommendedPosts]);

  // Loading State
  if (status === "loading" || !isInitialized) {
    return (
      <div className="w-[80vw] h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={56} />
      </div>
    );
  }

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
        <div className=" w-fit max-w-screen ">
          {recommendedPosts.length === 0 ? (
            <div className="w-full h-[80vh] flex items-center justify-center">
              <p className="text-lg text-gray-500">
                No posts available at the moment.
              </p>
            </div>
          ) : (
            <div className="flex w-screen space-x-1 text-center h-screen mt-16 lg:mt-0 lg:justify-left">
              <div className="w-screen lg:max-w-[30vw] lg:min-w-[250px] lg:w-full ">
                <div className="overflow-y-scroll scrollbar-hide mx-auto h-screen lg:min-w-fit w-full px-2">
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
              </div>

              <div className="h-full max-w-[55vw] z-20">
                <div
                  className={`fixed lg:relative lg:top-2 right-0 w-full lg:w-[55vw] h-[70vh] lg:h-[98vh] lg:bg-transparent transition-[bottom] duration-300 ${
                    mapToggle ? "bottom-0" : "-bottom-[80vh]"
                  }`}
                >
                  <div className="mb-2 flex justify-end px-6 lg:hidden">
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
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </>
  );
};

export default Dashboard;
