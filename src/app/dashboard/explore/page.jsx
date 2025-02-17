"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import L from "leaflet";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("./Map"), { ssr: false });

const Explore = () => {
  const mapRef = useRef(null);
  useEffect(() => {
    if (!mapRef.current) return; // Ensure ref is assigned

    const mapInstance = L.map(mapRef.current).setView([28.02, 48.55], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    return () => {
      mapInstance.remove(); // Cleanup to avoid multiple map instances
    };
  }, []);

  return (
    <div className="w-screen mt-14 md:mt-0 md:my-1 z-10 md:w-[84vw] ">
      <Map />
    </div>
  );
};

export default Explore;
