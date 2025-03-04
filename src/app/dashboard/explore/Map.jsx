"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [allPosts, setAllPosts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Initialize map and geolocation
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return; // Prevent re-initialization

    const mapInstance = L.map(mapRef.current).setView([27.7172, 85.324], 13);
    mapInstanceRef.current = mapInstance; // Store the map instance

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance);

    // Custom icon
    const icon = L.divIcon({
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e41b23" stroke="black" stroke-width="0.5" class="w-12 h-12">
          <path d="M12,2a8.009,8.009,0,0,0-8,8c0,3.255,2.363,5.958,4.866,8.819,0.792,0.906,1.612,1.843,2.342,2.791a1,1,0,0,0,1.584,0c0.73-.948,1.55-1.885,2.342-2.791C17.637,15.958,20,13.255,20,10A8.009,8.009,0,0,0,12,2Zm0,11a3,3,0,1,1,3-3A3,3,0,0,1,12,13Z"></path>
        </svg>`,
      className: "custom-map-icon",
      iconSize: [150, 150],
      iconAnchor: [19, 42],
    });

    setCustomIcon(icon);

    // Geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
      
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 14);
          L.marker([latitude, longitude], {
            icon: L.divIcon({
              html: `<div class="bg-blue-500 w-4 h-4 border border-black rounded-full"></div>`,
              className: "",
            }),
          })
            .addTo(mapInstanceRef.current)
            .bindPopup("You are here")
            .openPopup();
        }
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Fetch all posts when user location is available
  useEffect(() => {
    if (!userLocation) return;

    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/nearbyPosts`, {
          params: { lat: userLocation[0], lon: userLocation[1] },
        });
        setAllPosts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [userLocation]);

  // Search posts based on input
  const searchPosts = (term) => {
    if (!mapInstanceRef.current || !customIcon || !allPosts.length) return;

    setIsLoading(true);

    console.log("yete", allPosts);

    // Filter posts by name, caption, or description
    const filteredPosts = allPosts.filter((post) => {
      const searchLower = term.toLowerCase();
      return (
        post.name?.toLowerCase().includes(searchLower) ||
        post.caption?.toLowerCase().includes(searchLower) ||
        post.description?.toLowerCase().includes(searchLower)
      );
    });

    // Remove old markers
    markersRef.current.forEach((marker) =>
      mapInstanceRef.current.removeLayer(marker)
    );
    markersRef.current = [];

    if (filteredPosts.length === 0) {
      alert("No matching places found!");
      setIsLoading(false);
      return;
    }

    filteredPosts.forEach((post) => {
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
            popupDiv.classList.add("popup-card");

            const imgElement = document.createElement("img");
            imgElement.src = post.images[0]?.url || "/placeholder.jpg";
            imgElement.alt = post.caption || "Post Image";
            imgElement.classList.add("popup-card-img");

            const captionElement = document.createElement("h3");
            captionElement.textContent =
              post.address || post.name || "No Address";
            captionElement.classList.add("popup-card-caption");

            const button = document.createElement("button");
            button.textContent = "Go Here";
            button.classList.add("popup-card-btn");
            button.onclick = () => {
              drawRoute(userLocation, [post.location.lat, post.location.lng]);
              mapInstanceRef.current.setView(
                [post.location.lat, post.location.lng],
                14
              );
              mapInstanceRef.current.closePopup();
            };

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

    // Set view to the first filtered post
    if (filteredPosts.length > 0) {
      mapInstanceRef.current.setView(
        [filteredPosts[0].location.lat, filteredPosts[0].location.lng],
        14
      );
    }

    setIsLoading(false);
  };

  const drawRoute = async (start, end) => {
    if (!mapInstanceRef.current) return;

    const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;

    try {
      const response = await axios.get(url);
      const data = response.data;

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

  const fetchSearchResults = async (term) => {
    if (!term) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`/api/searchPosts?search=${term}`);
      setSearchResults(response.data.posts);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const addMarker = (post) => {
    if (!mapInstanceRef.current || !customIcon || !post.location) return;

    // Remove old markers
    markersRef.current.forEach((marker) =>
      mapInstanceRef.current.removeLayer(marker)
    );
    markersRef.current = [];

    const marker = L.marker([post.location.lat, post.location.lng], {
      icon: customIcon,
    })
      .addTo(mapInstanceRef.current)
      .bindPopup(() => {
        const popupDiv = document.createElement("div");
        popupDiv.classList.add("popup-card");

        const imgElement = document.createElement("img");
        imgElement.src = post.images[0]?.url || "/placeholder.jpg";
        imgElement.alt = post.caption || "Post Image";
        imgElement.classList.add("popup-card-img");

        const captionElement = document.createElement("h3");
        captionElement.textContent = post.address || post.name || "No Address";
        captionElement.classList.add("popup-card-caption");

        const button = document.createElement("button");
        button.textContent = "Go Here";
        button.classList.add("popup-card-btn");
        button.onclick = () => {
          drawRoute(userLocation, [post.location.lat, post.location.lng]);
          mapInstanceRef.current.setView(
            [post.location.lat, post.location.lng],
            14
          );
          mapInstanceRef.current.closePopup();
        };

        popupDiv.appendChild(imgElement);
        popupDiv.appendChild(captionElement);
        popupDiv.appendChild(button);

        return popupDiv;
      });

    markersRef.current.push(marker);
  };

  const debouncedSearch = useCallback(debounce(fetchSearchResults, 500), []);

  return (
    <div className="relative pt-10 lg:pt-0">
      <div
        ref={mapRef}
        className="h-[88vh] lg:h-[100vh] w-screen lg:w-[84vw] z-10"
      />
      <div className="absolute top-0 lg:top-5 left-0 lg:left-20 z-10 flex px-3 lg:px-0 w-[100vw] lg:w-[70vw] justify-between">
        <div className="bg-white border-2 border-black/50 md:border-none rounded-full flex items-center space-x-1 h-8 pl-2">
          <div>
            <Search size={16} />
          </div>
          <div className="relative">
            <Input
              className="min-w-28 lg:min-w-64 max-w-96 h-6 focus-visible:ring-transparent border-none font-semibold placeholder:text-black"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                debouncedSearch(e.target.value);
              }}
              placeholder="Search Places"
            />

            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                {searchResults.map((post) => (
                  <div
                    key={post._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchTerm(post.caption);
                      setSearchResults([]);

                      if (
                        post.location &&
                        !isNaN(post.location.lat) &&
                        !isNaN(post.location.lng)
                      ) {
                        addMarker(post); // Call function to set marker on map
                        mapInstanceRef.current.setView(
                          [post.location.lat, post.location.lng],
                          14
                        );
                      }
                    }}
                  >
                    <p className="text-sm font-semibold">{post.caption}</p>
                    <p className="text-xs text-gray-500">{post.address}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="rounded-full hover:bg-black hover:text-white w-[150px] border-2 flex justify-start border-black/50 md:border-none"
            variant="outline"
            onClick={() => searchPosts(searchTerm)}
            disabled={isLoading}
          >
            <Search className="mr-1" />
            {isLoading ? <Loader2 className="animate-spin" /> : "Nearby Places"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Debounce utility function
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export default Map;
