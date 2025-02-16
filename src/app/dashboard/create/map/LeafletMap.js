"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate } from "lucide-react";
import { Button } from "@/components/ui/button";
import Geocoder from "leaflet-control-geocoder"; // Correct import
import "leaflet-control-geocoder/dist/Control.Geocoder.css"; // Import CSS

const LeafletMap = ({
  selectedLocation,
  setSelectedLocation,
  setPost,
  post,
}) => {
  const [position, setPosition] = useState(null);
  const [map, setMap] = useState({});
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const customIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-red-500"><path d="M12,2a8.009,8.009,0,0,0-8,8c0,3.255,2.363,5.958,4.866,8.819,0.792,0.906,1.612,1.843,2.342,2.791a1,1,0,0,0,1.584,0c0.73-.948,1.55-1.885,2.342-2.791C17.637,15.958,20,13.255,20,10A8.009,8.009,0,0,0,12,2Zm0,11a3,3,0,1,1,3-3A3,3,0,0,1,12,13Z"></path></svg>`,
    className: "custom-map-icon",
    iconSize: [70, 70],
    iconAnchor: [10, 20],
  });

  useEffect(() => {
    if (mapRef.current) {
      const mapInstance = L.map(mapRef.current).setView([27.7172, 85.324], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);
      setMap(mapInstance);

      // Initialize geocoder
      const geocoder = Geocoder.nominatim(); // Correct usage
      L.Control.geocoder({
        collapsed: false,
        placeholder: "Search for a place",
        geocoder: geocoder,
        defaultMarkGeocode: false, // Disable default marker
      })
        .addTo(mapInstance)
        .on("markgeocode", function (e) {
          const { lat, lng } = e.geocode.center;
          console.log(e);

          setPost({ ...post, address: e.geocode.name });
          setPosition({ lat, lng });
          setSelectedLocation({ lat, lng });
          mapInstance.setView([lat, lng], 13);

          // Remove existing markers
          mapInstance.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
              mapInstance.removeLayer(layer);
            }
          });

          // Add a new marker
          if (markerRef.current) {
            markerRef.current.remove();
          }
          markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(
            mapInstance
          );
        });

      mapInstance.on("click", function (e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        updateMarker(mapInstance, lat, lng);
      });

      return () => {
        mapInstance.remove();
      };
    }
  }, []);

  const updateMarker = (mapInstance, lat, lng) => {
    if (!mapInstance) {
      console.error("Map instance is not available");
      return;
    }

    setPosition({ lat, lng });
    setSelectedLocation({ lat, lng });

    if (markerRef.current) {
      markerRef.current.remove();
    }

    markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(
      mapInstance
    );
    mapInstance.setView([lat, lng], 14);
  };

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (positioning) => {
          const lat = positioning.coords.latitude;
          const lng = positioning.coords.longitude;

          if (lat && lng) {
            updateMarker(map, lat, lng);
          } else {
            alert("Failed to retrieve valid coordinates.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Failed to access geolocation. Allow GPS permission!");
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    } else {
      alert("Geolocation is not supported by your browser!");
    }
  };

  return (
    <div className="border-2 relative ">
      <div
        ref={mapRef}
        className="h-[40vh] w-[40vw] min-w-[390px] min-h-[400px] z-0"
      />
      <Button
        onClick={handleLocate}
        className="absolute right-1 bottom-5 z-10 rounded-full hover:bg-black hover:text-white"
        variant="outline"
        type="button"
      >
        <Locate />
      </Button>
    </div>
  );
};

export default dynamic(() => Promise.resolve(LeafletMap), { ssr: false });
