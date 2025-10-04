import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["example.com", "another-domain.com"],
  },
  experimental: {
    // put other experimental features here if needed
  },
};

export default nextConfig;
