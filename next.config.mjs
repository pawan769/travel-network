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
    ],
  },
};

export default nextConfig;
