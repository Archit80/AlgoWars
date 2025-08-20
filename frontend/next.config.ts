import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // allow loading images from Supabase storage buckets
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
