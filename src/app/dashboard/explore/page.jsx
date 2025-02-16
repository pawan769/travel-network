"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import L from "leaflet";
import { useEffect, useRef } from "react";
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
    <div className="w-screen mt-14 md:mt-0 md:mr-0 z-10 md:w-[84vw] h-screen">
      <nav className="bg-gray-100 h-10 flex items-center justify-between px-5">
        <div className="border-2 border-black/30 rounded-md flex items-center space-x-1 h-7 pl-2">
          <div>
            <Search size={16} />
          </div>
          <div>
            <Input
              className=" min-w-28 md:min-w-64 max-w-64 h-6 focus-visible:ring-transparent "
              onChange={() => console.log("changed0")}
              placeholder="Search Places"
            />
          </div>
        </div>
        <div>Nearby Places Button</div>
      </nav>
      <div className="h-[94vh]  w-screen md:w-[84vw]">
        <Map />
      </div>
    </div>
  );
};

export default Explore;
