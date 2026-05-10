import path from 'path';
import type { NextConfig } from "next";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@shared': path.resolve(__dirname, '../shared'),
    };
    return config;
  },
};

export default nextConfig;
