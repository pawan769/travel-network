"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapPreview = dynamic(() => import("./MapPreview"), { ssr: false });

const RightSideBar = ({ visiblePosts, highlightedPostId }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true after mounting
  }, []);

  if (!isClient || !visiblePosts) return <p>Loading map...</p>; // Fallback during SSR or loading

  return (
    <div className="w-full h-screen">
      <MapPreview posts={visiblePosts} highlightedPostId={highlightedPostId} />
    </div>
  );
};

export default RightSideBar;
