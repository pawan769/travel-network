"use client";
import React, { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";

const MapPreview = ({ posts, highlightedPostId }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const recommendedPosts = useSelector((state) => state.app.recommendedPosts);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (highlightedPostId) {
      const selectedPost = recommendedPosts.find(
        (post) => post._id === highlightedPostId
      );
      setLocation(selectedPost?.location);
    }

    // Initialize map instance once
    if (!mapInstanceRef.current && mapRef.current) {
      const mapInstance = L.map(mapRef.current).setView([28.02, 48.55], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);
      mapInstanceRef.current = mapInstance;
    }

    if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;

      // Remove existing markers
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      const createIcon = (img, flag) => {
        const customIcon = L.divIcon({
          className: "custom-marker",
          html: ` 
          <div class="${
            flag
              ? "h-16 w-16 -translate-x-[1.5rem] -translate-y-20 "
              : "h-10 w-10 -translate-x-[0.65rem] -translate-y-12 "
          } flex flex-col bg-black text-white rounded-full items-center  relative z-50">
            <img 
              src="${img}" 
              alt="image" 
              class="h-full w-full object-cover aspect-square rounded-full" 
            />
          </div>
          <div class=" ${
            flag
              ? "-translate-y-[6rem] translate-x-[0.4rem]"
              : "-translate-y-16 translate-x-2 "
          } h-7 w-[0.10rem] bg-black rounded-3xl"></div>
        `,
        });
        return customIcon;
      };

      // Add markers for non-highlighted posts
      posts
        .filter((p) => p._id !== highlightedPostId)
        .forEach((post) => {
          const { lat, lng } = post.location;

          // Use the first image of multiple images or fallback image if no image is available
          const imageUrl = post.images?.length
            ? post.images[0].url
            : "/fallback-image.jpg";

          // Create marker instance
          const customIcon = createIcon(imageUrl, false);
          L.marker([lat, lng], { icon: customIcon, zIndexOffset: 0 }).addTo(
            map
          );
        });

      // Add marker for highlighted post
      if (highlightedPostId) {
        const highlightedPost = posts.find((p) => p._id === highlightedPostId);
        if (highlightedPost) {
          const { lat, lng } = highlightedPost.location;

          // Use the first image of multiple images or fallback image if no image is available
          const imageUrl = highlightedPost.images?.length
            ? highlightedPost.images[0].url
            : "/fallback-image.jpg";

          const customIcon = createIcon(imageUrl, true);
          L.marker([lat, lng], { icon: customIcon, zIndexOffset: 1000 }).addTo(
            map
          );
        }
      }

      // Reset the map view
      const zoom = map.getZoom();
      map.setView(
        location ? [location.lat, location.lng] : [27.7172, 85.324],
        zoom < 12 ? zoom : 12
      );
    }
  }, [posts, highlightedPostId, location, recommendedPosts]);

  return (
    <div
      ref={mapRef}
      className="h-full w-full z-20  rounded-md "
    ></div>
  );
};

export default dynamic(() => Promise.resolve(MapPreview), { ssr: false });
