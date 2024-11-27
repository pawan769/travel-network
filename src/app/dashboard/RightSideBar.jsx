import React, { useEffect, useState } from "react";
import MapPreview from "./MapPreview.jsx";

const RightSideBar = ({ visiblePosts }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true after mounting
  }, []);

  if (!isClient || !visiblePosts) return <p>Loading map...</p>; // Fallback during SSR or loading

  return (
    <div className="w-full h-screen">
      <MapPreview posts={visiblePosts} />
    </div>
  );
};

export default RightSideBar;
