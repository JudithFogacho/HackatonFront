import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Desactivar las comprobaciones de ESLint durante la compilación
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Desactivar las comprobaciones de TypeScript durante la compilación
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
