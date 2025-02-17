"use client";
import { useState, useEffect, useRef } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Map = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeLayerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [customIcon, setCustomIcon] = useState(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize the map only when mapRef.current is available
    const mapInstance = L.map(mapRef.current).setView([28.02, 48.55], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);
    mapInstanceRef.current = mapInstance;

    // Set custom icon
    const icon = L.divIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-red-500"><path d="M12,2a8.009,8.009,0,0,0-8,8c0,3.255,2.363,5.958,4.866,8.819,0.792,0.906,1.612,1.843,2.342,2.791a1,1,0,0,0,1.584,0c0.73-.948,1.55-1.885,2.342-2.791C17.637,15.958,20,13.255,20,10A8.009,8.009,0,0,0,12,2Zm0,11a3,3,0,1,1,3-3A3,3,0,0,1,12,13Z"></path></svg>`,
      className: "custom-map-icon",
      iconSize: [70, 70],
      iconAnchor: [10, 20],
    });
    setCustomIcon(icon);

    // Geolocation to set user's location
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
          .addTo(mapInstance)
          .bindPopup("You are here")
          .openPopup();
      },
      (error) => console.error("Geolocation error:", error)
    );

    // Event listener for the "placeSelected" event
    const handlePlaceSelected = (e) => {
      const { lat, lon } = e.detail;
      console.log("Selected place coordinates:", lat, lon);
      // You can do more with the coordinates (like center the map on the selected place)
      mapInstance.setView([lat, lon], 14);
    };

    // Attach the event listener
    window.addEventListener("placeSelected", handlePlaceSelected);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("placeSelected", handlePlaceSelected);
    };
  }, [customIcon]);

  // Empty dependency array ensures this runs once

  const searchNearbyPlaces = async () => {
    if (!mapInstanceRef.current || !customIcon || !userLocation) return;

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

          markersRef.current.forEach((marker) =>
            mapInstanceRef.current.removeLayer(marker)
          );
          markersRef.current = [];

          places.forEach((place) => {
            const marker = L.marker([place.lat, place.lon], {
              icon: customIcon,
            })
              .addTo(mapInstanceRef.current)
              .bindPopup(() => {
                const popupDiv = document.createElement("div");
                popupDiv.innerHTML = `<b>${place.display_name}</b><br>`;
                const button = document.createElement("button");
                button.textContent = "Go Here";
                button.onclick = () => {
                  // Call drawRoute when the "Go Here" button is clicked
                  drawRoute(userLocation, [place.lat, place.lon]);
                  // Optionally, you can also center the map on the selected place
                  mapInstanceRef.current.setView([place.lat, place.lon], 14);
                };
                popupDiv.appendChild(button);
                return popupDiv;
              });

            markersRef.current.push(marker);
          });
        } catch (error) {
          console.error("Error fetching tourist places:", error);
        }
      },
      (error) => console.error("Geolocation error:", error)
    );
  };

  const drawRoute = async (start, end) => {
    if (!mapInstanceRef.current) return;

    const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const routeCoordinates = data.routes[0].geometry.coordinates.map(
        (coord) => [coord[1], coord[0]]
      );

      if (routeLayerRef.current) {
        mapInstanceRef.current.removeLayer(routeLayerRef.current);
      }

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

export default Map;
