import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 async rewrites() {
    return [
      {
        source: '/', 
        destination: '/Home', 
      },
    ]
  },
};

export default nextConfig;
