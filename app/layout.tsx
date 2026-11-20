import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans, Space_Grotesk } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/lib/site";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "Manikanta Sriram",
    "Manikanta Sriram Developer",
    "Manikanta Sriram Full Stack Developer",
    "Full Stack Developer Hyderabad",
    "React Developer Hyderabad",
    "React",
    "TypeScript",
    "FastAPI",
    "PostgreSQL",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: site.name,
    title: "Manikanta Sriram | Full Stack Developer",
    description: site.shortDescription,
    locale: "en_IN",
    firstName: "Manikanta",
    lastName: "Sriram",
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: "Manikanta Sriram, Full Stack Developer in Hyderabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manikanta Sriram | Full Stack Developer",
    description: "React, TypeScript and Python (FastAPI) developer in Hyderabad, India.",
    images: [site.ogImage],
  },
  formatDetection: { telephone: false },
  // Search Console verification
  verification: { google: "fUTZGYZEQnm_M990WsXkmx_NhukeEbEzxTjY2Hjwcmk" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

/**
 * Runs before first paint: applies the saved (or OS) theme, sets data-js so CSS can hold back animated
 * elements (dropped after 4s as a fallback), and sets data-lazy unless the URL has a hash or the user
 * clicks before hydration.
 */
const themeScript = `(function(){var d=document.documentElement,t;try{t=localStorage.getItem("theme")}catch(e){}if(t!=="dark"&&t!=="light"){t=window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.dataset.theme=t;d.style.colorScheme=t;d.dataset.js="1";if(!location.hash){d.dataset.lazy="1";addEventListener("click",function(){delete d.dataset.lazy},{capture:true,once:true})}setTimeout(function(){if(!window.__motionReady){delete d.dataset.js;delete d.dataset.lazy}},4000)})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <JsonLd />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
