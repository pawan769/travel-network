import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MapBar = ({ posts, highlightedPostId }) => {
  const [location, setLocation] = useState(null);
  const recommendedPosts = useSelector((state) => state.app.recommendedPosts);
  useEffect(() => {
    if (highlightedPostId) {
      const selectedPost = recommendedPosts.find(
        (post) => post._id === highlightedPostId
      );
      setLocation(selectedPost?.location);
    }
  }, [highlightedPostId, recommendedPosts]);

  const createIcon = (img) => {
    const customIcon = L.divIcon({
      className: "custom-marker",
      html: `
      <div class="h-10 w-10 flex flex-col bg-black text-white rounded-full items-center -translate-y-12 -translate-x-[0.65rem] relative z-50">
      
      <img 
      src="${img}" 
      alt="image" 
      class=" h-full w-full object-cover aspect-square rounded-full bg-red-400" 
      />
      
        
        </div>
        <div class="h-7 w-[0.10rem] bg-black translate-x-2 -translate-y-16 rounded-3xl"></div>
    
    `,
    });
    return customIcon;
  };

  if (!location) {
    return null;
  }
  const customIcon2 = L.divIcon({
    className: "custom-marker",
    html: '<div style="color: red; font-size: 24px;">📍</div>',
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });

  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={13}
      scrollWheelZoom={true}
      className="h-[90%] w-full fixed mt-10"
      // Ensure the map has proper dimensions
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {posts.map((elem, index) => {
        const customIcon = createIcon(elem.image.url);
        return (
          <Marker
            key={index}
            position={[elem.location.lat, elem.location.lng]}
            icon={customIcon}
          ></Marker>
        );
      })}
      <Marker position={[27.6922368, 85.3213184]} icon={customIcon2}></Marker>
    </MapContainer>
  );
};

export default MapBar;
