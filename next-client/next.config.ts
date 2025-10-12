import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ]
  },
  webpack: (config) => {
    config.watchOptions = {
      ignored: ['**/myLibUI/**']
    }
    return config
  },
};

export default nextConfig;
