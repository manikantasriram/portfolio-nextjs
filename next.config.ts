import type { NextConfig } from "next";

/** NEXT_PUBLIC_SITE_URL, else Vercel's production domain, else the default vercel.app address. */
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://manikantasriram.vercel.app")
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // Static export to out/; headers are in vercel.json.
  output: "export",
  env: { NEXT_PUBLIC_SITE_URL: siteUrl },
  images: {
    // no image optimiser in a static export
    unoptimized: true,
  },
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
