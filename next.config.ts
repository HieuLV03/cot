import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jodtgvsgsdtbkmhdbcri.supabase.co",   // Domain cụ thể của bạn
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",   // Cho phép tất cả subdomain Supabase
      },
    ],
  },
};

export default nextConfig;