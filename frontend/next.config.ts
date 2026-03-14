import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // allow loading images from Supabase storage buckets
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encujaqfrdkhzkpryemp.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },
  // Enable compression
  compress: true,
  // Disable problematic optimizations for now
  experimental: {
    optimizeCss: false, // Disable to avoid critters issues
  },
};

export default nextConfig;
