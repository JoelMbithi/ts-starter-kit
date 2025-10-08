import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all remote images
      },
    ],
  },
  experimental: {
    // put other experimental features here if needed
  },
};

export default nextConfig;
