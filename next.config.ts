import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hplnvzhpsyauclwy.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**", // permite cualquier path
      },
    ],
  },
};

export default nextConfig;
