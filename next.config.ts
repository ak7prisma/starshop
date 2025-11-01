import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  eslint: {

    ignoreDuringBuilds: true, 
  },

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