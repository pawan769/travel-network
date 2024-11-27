"use client";
import React, { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import dynamic from "next/dynamic";
import "./mapPreview.css";

const MapPreview = ({ posts }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      const mapInstance = L.map(mapRef.current).setView([27.7172, 85.324], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);
      mapInstanceRef.current = mapInstance;
    }

    if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;

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
          .setContent(popupContent);

        popup.addTo(map);

        // Add click handler to the popup's DOM element directly
        // const popupElement = popup._container;
        // if (popupElement) {
        //   popupElement.addEventListener("click", () => {
        //      console.log(post.caption);
        //     handlePopupClick(popupElement);
        //   });
        // }
      });

      // Reset the map view to avoid zooming into the last popup
      map.setView([27.7172, 85.324], 13);
    }
  }, [posts]);

  return <div ref={mapRef} className="h-[90vh] w-[40vw] fixed mt-10"></div>;
};

export default dynamic(() => Promise.resolve(MapPreview), { ssr: false });
