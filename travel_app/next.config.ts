import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    domains: ['oex06hj5me.ufs.sh'], // Add your UploadThing domain
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oex06hj5me.ufs.sh',
        port: '',
        pathname: '/**',
      },
      // Add other domains you might use
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // For Google profile images
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
