const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/drkl3ydge/**",
      },
      {
        protocol: "https",
        hostname: "nominatim.openstreetmap.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
