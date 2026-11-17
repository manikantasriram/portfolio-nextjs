import type { NextConfig } from "next";

/**
 * The site's public address, used for the canonical URL, Open Graph tags, sitemap and JSON-LD.
 *  1. NEXT_PUBLIC_SITE_URL, if you set it (use this for a custom domain)
 *  2. on Vercel, the project's production domain (set automatically at build time)
 *  3. otherwise the live Vercel address (local builds)
 */
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://manikantasriram.vercel.app")
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // Fully static site: `next build` writes plain HTML/CSS/JS to `out/`.
  // Vercel detects this and serves it from its CDN (headers live in vercel.json).
  output: "export",
  env: { NEXT_PUBLIC_SITE_URL: siteUrl },
  images: {
    // No image server in a static export. Photos are pre-sized in /public/images.
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
