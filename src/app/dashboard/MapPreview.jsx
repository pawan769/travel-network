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
      const hello = recommendedPosts.filter(
        (elem) => elem._id === highlightedPostId
      );
      setLocation(hello[0]?.location);
      console.log(location);
    }
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

      map.eachLayer((layer) => {
        if (layer instanceof L.Popup) {
          map.removeLayer(layer);
        }
      });

      posts.forEach((post) => {
        const { lat, lng } = post.location;

        // Create popup content with Tailwind classes
        const popupContent = `
          <div class="popup-content text-center bg-black text-white rounded-lg shadow-md p-1 w-[100px] h-[105px] content-center">
            <img src="${post.image.url}" alt="${post.caption}" class="rounded-lg object-cover w-[100px] h-[105px] mb-2" />
            <p class="text-xs">${post.caption}</p>
          </div>`;

        // Create popup instance
        const popup = L.popup({
          closeOnClick: false,
          autoClose: false,
          closeButton: false,
        })
          .setLatLng([lat, lng])
          .setContent(popupContent).addTo(map);
        // if (post._id === highlightedPost._id) {
        //   map.removeLayer(popup);
        //   popup.addTo(map);
        // }
        // Add click handler to the popup's DOM element directly
        const popupElement = popup._container;
        if (popupElement) {
          popupElement.addEventListener("click", () => {
            console.log(post.caption);
            map.removeLayer(popup);
            // popup.addTo(map);
          });
        }
      });

      // Reset the map view to avoid zooming into the last popup
      map.setView(
        location ? [location.lat, location.lng] : [27.7172, 85.324],
        location ? 13.1 : 13
      );
    }
  }, [posts, highlightedPostId, location, recommendedPosts]);

  return <div ref={mapRef} className="h-[90vh] w-[40vw] fixed mt-10"></div>;
};

export default dynamic(() => Promise.resolve(MapPreview), { ssr: false });
