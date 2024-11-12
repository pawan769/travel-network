"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import leaflet-control-geocoder
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import LControlGeocoder from "leaflet-control-geocoder";

// Disable SSR (Server-Side Rendering) for the map
const LeafletMap = ({ selectedLocation, setSelectedLocation }) => {
  const [position, setPosition] = useState(null);
  const [map, setMap] = useState({});
  const mapRef = useRef(null); // To reference the map container
  const markerRef = useRef(null); // To store the reference for the marker

  const customIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-red-500"><path d="M12,2a8.009,8.009,0,0,0-8,8c0,3.255,2.363,5.958,4.866,8.819,0.792,0.906,1.612,1.843,2.342,2.791a1,1,0,0,0,1.584,0c0.73-.948,1.55-1.885,2.342-2.791C17.637,15.958,20,13.255,20,10A8.009,8.009,0,0,0,12,2Zm0,11a3,3,0,1,1,3-3A3,3,0,0,1,12,13Z"></path></svg>`,
    className: "custom-map-icon",
    iconSize: [40, 40],
    iconAnchor: [10, 20],
  });
  useEffect(() => {
    if (mapRef.current) {
      const mapInstance = L.map(mapRef.current).setView([27.7172, 85.324], 13); // Default position

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);
      setMap(mapInstance);

      // Add search functionality (geocoder)
      const geocoder = L.Control.Geocoder.nominatim();
      L.Control.geocoder({
        collapsed: false,
        placeholder: "Search for a place",
        geocoder: geocoder,
        createMarker: () => null,
      })
        .addTo(mapInstance)
        .on("markgeocode", function (e) {
          const { lat, lng } = e.geocode.center;
          setPosition({ lat, lng });
          setSelectedLocation({ lat, lng });
          mapInstance.setView([lat, lng], 13);

          mapInstance.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
              mapInstance.removeLayer(layer); // Remove the default geocoder marker
            }
          });

          // Create a new marker with the custom icon
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

        //     geocoder.reverse(
        //       [lat, lng],
        //       mapInstance.options.crs.scale(mapInstance.getZoom()),
        //       (results) => {
        //         const place = results.length > 0 ? results[0] : null;
        //         const placeName = place ? place.name : "Unknown location"; // Get the name of the place

        //         // You can now use the place name
        //         console.log("Place Name: ", placeName);
        //         alert("You clicked on: " + placeName);
        //       }
        //     );
      });

      return () => {
        mapInstance.remove(); // Cleanup the map on component unmount
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
            updateMarker(map, lat, lng); // Call updateMarker with valid lat/lng
          } else {
            alert("Failed to retrieve valid coordinates.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Failed to access geolocation. Allow GPS permission!");
        },
        {
          enableHighAccuracy: true, // Request more precise location
          maximumAge: 0, // Don't use cached results
          timeout: 5000, // Set a timeout for the geolocation request
        }
      );
    } else {
      alert("Geolocation is not supported by your browser!");
    }
  };

  const handleSelectLocation = () => {
    if (position) {
      alert(
        `Selected Location: Latitude: ${position.lat}, Longitude: ${position.lng}`
      );
    } else {
      alert("Please click on the map or use the locate button.");
    }
  };

  return (
    <div>
      <div className="border-2 relative">
        <div ref={mapRef} className="h-[400px] w-[450px]  relative z-0" />
        <Button
          onClick={handleLocate}
          className="absolute right-1 bottom-5 z-10 rounded-full hover:bg-black hover:text-white"
          variant="outline"
          type="button"
        >
          <Locate />
        </Button>
      </div>

      <Button
        onClick={handleSelectLocation}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        type="button"
      >
        Select this location
      </Button>
    </div>
  );
};

// Dynamically load the map and ensure it's client-side
export default dynamic(() => Promise.resolve(LeafletMap), { ssr: false });
