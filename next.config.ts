import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Required allowlist from Next.js 16 onward
    qualities: [75, 85],
  },
};

export default nextConfig;
