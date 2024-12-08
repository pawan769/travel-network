"use client";
import React, { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import dynamic from "next/dynamic";
import "./mapPreview.css";
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

      // Remove existing popups
      map.eachLayer((layer) => {
        if (layer instanceof L.Popup) {
          map.removeLayer(layer);
        }
      });

      // Add popups for non-highlighted posts
      posts
        .filter((p) => p._id !== highlightedPostId)
        .forEach((post) => {
          const { lat, lng } = post.location;

          // Create popup content
          const popupContent = `
          <div class="popup-content">
            <img src="${post.image.url}" alt="${post.caption}" class="popup-img" />
            <p class="popup-text">${post.caption}</p>
          </div>`;

          // Create popup instance
          const popup = L.popup({
            closeOnClick: false,
            autoClose: false,
            closeButton: false,
          })
            .setLatLng([lat, lng])
            .setContent(popupContent)
            .addTo(map);
        });

      // Add popup for highlighted post
      if (highlightedPostId) {
        const highlightedPost = posts.find((p) => p._id === highlightedPostId);
        if (highlightedPost) {
          const { lat, lng } = highlightedPost.location;

          const popupContent = `
          <div class="popup-content highlighted">
            <img src="${highlightedPost.image.url}" alt="${highlightedPost.caption}" class="popup-img" />
            <p class="popup-text">${highlightedPost.caption}</p>
          </div>`;

          const popup = L.popup({
            closeOnClick: false,
            autoClose: false,
            closeButton: false,
          })
            .setLatLng([lat, lng])
            .setContent(popupContent)
            .addTo(map);
        }
      }

      // Reset the map view
      map.setView(
        location ? [location.lat, location.lng] : [27.7172, 85.324],
        12
      );
    }
  }, [posts, highlightedPostId, location, recommendedPosts]);

  return <div ref={mapRef} className="h-[90vh] w-[40vw] fixed mt-10"></div>;
};

export default dynamic(() => Promise.resolve(MapPreview), { ssr: false });
