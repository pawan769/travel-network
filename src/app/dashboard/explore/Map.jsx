"use client";
import { useState, useEffect, useRef } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import axios from "axios";

const Map = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeLayerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [customIcon, setCustomIcon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e41b23" stroke="black" stroke-width="0.5" class="w-12 h-12">
          <path d="M12,2a8.009,8.009,0,0,0-8,8c0,3.255,2.363,5.958,4.866,8.819,0.792,0.906,1.612,1.843,2.342,2.791a1,1,0,0,0,1.584,0c0.73-.948,1.55-1.885,2.342-2.791C17.637,15.958,20,13.255,20,10A8.009,8.009,0,0,0,12,2Zm0,11a3,3,0,1,1,3-3A3,3,0,0,1,12,13Z"></path>
        </svg>`,
      className: "custom-map-icon",
      iconSize: [150, 150], // Increased size
      iconAnchor: [19, 42],
    });

    setCustomIcon(icon);

    // Geolocation to set user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        mapInstance.setView([latitude, longitude], 14);

        L.marker([latitude, longitude], {
          icon: L.divIcon({
            html: `<div class="bg-blue-500 w-4 h-4 border border-black  rounded-full"></div>`,
            className: "",
          }),
        })
          .addTo(mapInstance)
          .bindPopup("You are here")
          .openPopup();
      },
      (error) => console.error("Geolocation error:", error)
    );

    const handlePlaceSelected = (e) => {
      const { lat, lon } = e.detail;
      console.log("Selected place coordinates:", lat, lon);

      mapInstance.setView([lat, lon], 14);
    };

    window.addEventListener("placeSelected", handlePlaceSelected);

    return () => {
      window.removeEventListener("placeSelected", handlePlaceSelected);
    };
  }, [customIcon]);

  const searchNearbyPlaces = async () => {
    setIsLoading(true);
    if (!mapInstanceRef.current || !customIcon || !userLocation) return;

    const [latitude, longitude] = userLocation;

    try {
      const response = await axios.get(`/api/nearbyPosts`, {
        params: { lat: latitude, lon: longitude },
      });
      const posts = response.data;
      console.log(posts);

      markersRef.current.forEach((marker) =>
        mapInstanceRef.current.removeLayer(marker)
      );
      markersRef.current = [];

      posts.forEach((post) => {
        if (
          post.location &&
          !isNaN(post.location.lat) &&
          !isNaN(post.location.lng)
        ) {
          const marker = L.marker([post.location.lat, post.location.lng], {
            icon: customIcon,
          })
            .addTo(mapInstanceRef.current)
            .bindPopup(() => {
              const popupDiv = document.createElement("div");

              // Create a card container
              popupDiv.classList.add("popup-card");

              // Add image to the card
              const imgElement = document.createElement("img");
              imgElement.src = post.image.url;
              imgElement.alt = post.caption;
              imgElement.classList.add("popup-card-img");

              // Add caption
              const captionElement = document.createElement("h3");
              captionElement.textContent = post.address;
              captionElement.classList.add("popup-card-caption");

              // Create a button for navigation
              const button = document.createElement("button");
              button.textContent = "Go Here";
              button.classList.add("popup-card-btn");
              button.onclick = () => {
                drawRoute(userLocation, [post.location.lat, post.location.lng]);
                mapInstanceRef.current.setView(
                  [post.location.lat, post.location.lng],
                  14
                );

                // Close the popup
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.closePopup();
                }
              };

              // Append elements to the popup card
              popupDiv.appendChild(imgElement);
              popupDiv.appendChild(captionElement);
              popupDiv.appendChild(button);

              return popupDiv;
            });

          markersRef.current.push(marker);
        } else {
          console.warn(`Invalid coordinates for post: ${post._id}`);
        }
      });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching nearby posts:", error);
    }
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
    <div className=" relative pt-10 md:pt-0 ">
      <div
        ref={mapRef}
        className=" h-[88vh] md:h-[100vh] w-screen md:w-[84vw] z-10"
      />
      <div className="absolute top-0 md:top-5 left-0 md:left-20 z-10 flex px-3 md:px-0 w-[100vw]  md:w-[70vw] justify-between">
        <div className="  bg-white border-2 border-black/50 md:border-none rounded-full flex items-center space-x-1 h-8 pl-2">
          <div>
            <Search size={16} />
          </div>
          <div>
            <Input
              className=" min-w-28 md:min-w-64 max-w-96 h-6 focus-visible:ring-transparent  border-none font-semibold placeholder:text-black "
              onChange={() => console.log("changed0")}
              placeholder="Search Places"
            />
          </div>
        </div>

        <div className=" flex gap-2">
          <Button
            className="rounded-full hover:bg-black hover:text-white w-[150px] border-2 border-black/50 md:border-none"
            variant="outline"
            onClick={searchNearbyPlaces}
          >
            <Search className="mr-1 " />{" "}
            {isLoading ? <Loader2 className="animate-spin" /> : "Nearby Places"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Map;
