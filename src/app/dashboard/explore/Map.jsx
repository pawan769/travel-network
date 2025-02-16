"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

// Disable SSR for the map
const Map = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeLayerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const customIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-red-500"><path d="M12,2a8.009,8.009,0,0,0-8,8c0,3.255,2.363,5.958,4.866,8.819,0.792,0.906,1.612,1.843,2.342,2.791a1,1,0,0,0,1.584,0c0.73-.948,1.55-1.885,2.342-2.791C17.637,15.958,20,13.255,20,10A8.009,8.009,0,0,0,12,2Zm0,11a3,3,0,1,1,3-3A3,3,0,0,1,12,13Z"></path></svg>`,
    className: "custom-map-icon",
    iconSize: [70, 70],
    iconAnchor: [10, 20],
  });

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [27.7172, 85.324],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      // Get User Location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          L.marker([latitude, longitude], {
            icon: L.divIcon({
              html: `<div class="bg-blue-500 w-6 h-6 rounded-full"></div>`,
              className: "",
            }),
          })
            .addTo(mapInstanceRef.current)
            .bindPopup("You are here")
            .openPopup();
        },
        (error) => console.error("Geolocation error:", error)
      );
    }
  }, []);

  // Function to search for nearby tourist places
  const searchNearbyPlaces = async () => {
    if (!mapInstanceRef.current) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        mapInstanceRef.current.setView([latitude, longitude], 14);

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=tourist&viewbox=${
          longitude - 0.1
        },${latitude - 0.1},${longitude + 0.1},${latitude + 0.1}&bounded=1`;

        try {
          const response = await fetch(url);
          const places = await response.json();

          // Remove existing markers
          markersRef.current.forEach((marker) =>
            mapInstanceRef.current.removeLayer(marker)
          );
          markersRef.current = [];

          // Add markers for each tourist place
          places.forEach((place) => {
            const marker = L.marker([place.lat, place.lon], {
              icon: customIcon,
            })
              .addTo(mapInstanceRef.current)
              .bindPopup(
                `<b>${place.display_name}</b><br><button onclick="window.dispatchEvent(new CustomEvent('placeSelected', { detail: { lat: ${place.lat}, lon: ${place.lon} } }))">Go Here</button>`
              );
            markersRef.current.push(marker);
          });

          // Listen for custom event when user selects a place
          window.addEventListener("placeSelected", (event) => {
            const { lat, lon } = event.detail;
            setSelectedPlace([lat, lon]);
            drawRoute([latitude, longitude], [lat, lon]);
          });
        } catch (error) {
          console.error("Error fetching tourist places:", error);
        }
      },
      (error) => console.error("Geolocation error:", error)
    );
  };

  // Function to draw the shortest route
  const drawRoute = async (start, end) => {
    if (!mapInstanceRef.current) return;

    const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const routeCoordinates = data.routes[0].geometry.coordinates.map(
        (coord) => [coord[1], coord[0]]
      );

      // Remove existing route if any
      if (routeLayerRef.current) {
        mapInstanceRef.current.removeLayer(routeLayerRef.current);
      }

      // Draw the route
      routeLayerRef.current = L.polyline(routeCoordinates, {
        color: "blue",
        weight: 4,
      }).addTo(mapInstanceRef.current);
      mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds());
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  return (
    <div className="border-2 relative">
      <div ref={mapRef} className="h-[94vh] w-screen md:w-[84vw] z-10" />

      {/* Locate & Search Nearby Buttons */}
      <div className="absolute right-10 top-5 z-10 flex gap-2">
        <Button
          className="rounded-full hover:bg-black hover:text-white"
          variant="outline"
          onClick={searchNearbyPlaces}
        >
          <Search className="mr-1" /> Nearby Tourist Places
        </Button>
      </div>
    </div>
  );
};

// Export with dynamic import to disable SSR
export default dynamic(() => Promise.resolve(Map), { ssr: false });
