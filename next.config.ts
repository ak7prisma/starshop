import type { NextConfig } from "next";

const nextConfig: NextConfig = {

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
            {
                protocol: 'https',
                hostname: '**.supabase.in',
            },
        ],
    },

    async rewrites() {
        return [
            {
                source: '/',
                destination: '/Home',
            },
        ];
    },
};

export default nextConfig;