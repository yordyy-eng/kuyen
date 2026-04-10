import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Required for ARM64 compatibility in some environments if needed, 
  // but standalone is the primary requirement here.
};

export default nextConfig;
