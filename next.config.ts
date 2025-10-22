import type { NextConfig } from "next";
//const injectWhyDidYouRender = require("./scripts/why-did-you-render");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "web.poecdn.com",
      },
    ],
  },
  // webpack: (config, context) => {
  //   injectWhyDidYouRender(config, context);

  //   return config;
  // },
  // Checks done in CI
  typescript: {
    ignoreBuildErrors: true,
  },
  cacheLife: {
    mine: {
      stale: 120, // 2 minutes
      revalidate: 120, // 2 minutes
      expire: 120, // 2 minutes
    },
  },
};

export default nextConfig;
