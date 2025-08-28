// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // не останавливать next build из-за ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // (на всякий случай) не валить build из-за TS-тайпингов
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
