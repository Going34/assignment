import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js auto-detects the project root by scanning for lockfiles. A stray
  // ~/package-lock.json can make it pick the home directory — pin it here.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
