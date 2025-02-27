/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // Use 'http' if applicable
        hostname: "images.pexels.com", // Replace with your image's domain
        port: "", // Optional, leave empty if not needed
        pathname: "/photos/**", // Use `/**` to match all paths under this hostname
      },
      {
        protocol: "https", // Use 'http' if applicable
        hostname: "res.cloudinary.com", // Replace with your image's domain
        port: "", // Optional, leave empty if not needed
        pathname: "/**", // Use `/**` to match all paths under this hostname
      },
      {
        protocol: "https", // Ensure protocol is https for OpenStreetMap
        hostname: "nominatim.openstreetmap.org", // OpenStreetMap's domain
        port: "", // Optional, leave empty if not needed
        pathname: "/**", // This matches all paths under OpenStreetMap domain
      },
    ],
  },
};

export default nextConfig;