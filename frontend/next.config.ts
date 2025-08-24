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
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
  },
  // Enable compression
  compress: true,
  // Bundle analyzer (optional)
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Enable bundle splitting for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
