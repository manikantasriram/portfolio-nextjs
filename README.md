# Manikanta Sriram · Portfolio

Personal portfolio for **Manikanta Sriram**, Full Stack Developer in Hyderabad, India.

Built with Next.js (App Router) + TypeScript + Tailwind CSS, animated with GSAP + ScrollTrigger,
icons from Lucide. It exports to plain static files and is set up to deploy on **Vercel**.

## Stack

| Area      | Choice                                                               |
| --------- | -------------------------------------------------------------------- |
| Framework | Next.js 16, App Router, static export (`output: "export"`)           |
| Language  | TypeScript (strict)                                                  |
| Styling   | Tailwind CSS 4 + design tokens as CSS variables in `app/globals.css` |
| Animation | CSS for the hero and simple reveals; GSAP 3 (ScrollTrigger, SplitText), lazy-loaded, for scroll scenes |
| Icons     | `lucide-react`                                                       |
| Fonts     | Space Grotesk, DM Sans, DM Mono via `next/font` (self-hosted)        |
| Hosting   | Vercel (static). A Netlify config is kept as an alternative          |

## Requirements

- Node.js 26 (`.nvmrc`; the Vercel project builds on 26.x). Node 24 also works locally.
- npm

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Opens on <http://localhost:3000>. Edits hot-reload.

```bash
npm run lint
```

```bash
npm run typecheck
```

## Build

```bash
npm run build
```

This writes the complete static site to `out/`. To preview exactly what will be served:

```bash
npx serve out
```

## Deploy to Vercel

`vercel.json` sets the framework and the response headers (Content-Security-Policy, HSTS,
`X-Content-Type-Options` and friends, plus long cache lifetimes for images and icons). Nothing else needs configuring:
Vercel detects Next.js, runs `npm run build`, and serves the static export from its CDN.

**Option A: Git (recommended).** Push this folder to a GitHub repository, then in Vercel choose
*Add New → Project*, import the repository and click *Deploy*. Every push to the main branch
deploys to production; every other branch or pull request gets its own preview URL.

**Option B: Vercel CLI.** From this folder, a preview deployment:

```bash
npx vercel
```

and a production deployment:

```bash
npx vercel --prod
```

### The site URL

The canonical URL, Open Graph tags, `sitemap.xml`, `robots.txt` and JSON-LD all use one address,
resolved at build time in `next.config.ts`:

1. `NEXT_PUBLIC_SITE_URL`, if you set it. Use this once you add a custom domain
   (Vercel → Project → Settings → Environment Variables, e.g. `https://yourdomain.com`).
2. Otherwise, on Vercel, the project's production domain (`VERCEL_PROJECT_PRODUCTION_URL`,
   provided automatically, e.g. `your-project.vercel.app`).
3. Otherwise `https://manikantasriram.netlify.app`, the original address (local builds).

### After the first deploy

- Open `/google9d715ed03759a179.html`, `/sitemap.xml` and `/robots.txt` on the new domain.
- Check both "Download resume" buttons.
- In Google Search Console, add the new domain as a property (the verification file is already
  served) and submit the sitemap.
- The old Netlify site still serves the previous version. Once Vercel is live, take it down or
  redirect it to the new domain so search engines see a single site.

### Netlify (alternative)

`netlify.toml` is still valid: build command `npm run build`, publish directory `out`.

## Editing content

All professional content lives in two files. Components never hard-code facts, and each fact is
shown in exactly one section.

| File             | Holds                                                                               |
| ---------------- | ----------------------------------------------------------------------------------- |
| `lib/content.ts` | Hero role and tagline, about and approach, experience, projects, skills, education  |
| `lib/site.ts`    | Name, email, GitHub and LinkedIn links, resume path, and the section map            |

The section map in `lib/site.ts` (id, label, "file name", order) drives the nav, the section
headers and the status bar.

Static files are in `public/`:

- `Manikanta_Sriram_Resume.pdf`: replace the file (same name) to update the resume
- `google9d715ed03759a179.html`: Google Search Console verification, do not remove
- `og.png`: 1200×630 social card
- `images/`: profile photo
- `skills/`: skill icons (SVG)

Files in `images/` and `skills/` are cached for a year. If you replace one, give it a new file
name (and update the reference) so returning visitors get the new version.

## Project structure

```
app/
  layout.tsx        fonts, metadata, theme + motion bootstrap script, JSON-LD
  page.tsx          the page: all sections in order
  globals.css       design tokens (light + dark) and component styles
  sitemap.ts        /sitemap.xml
  robots.ts         /robots.txt
  icon.svg          favicon
  not-found.tsx     404 page
components/
  motion.tsx            starts motion: CSS reveals now, GSAP scenes on first interaction
  nav.tsx               sticky nav, mobile menu, scroll progress, gliding active highlight
  hero.tsx              name, role, tagline and the main.py editor card
  hero-backdrop.tsx     dot grid with pointer spotlight
  section.tsx           section wrapper with the git-diff style header
  about.tsx             background statement, portrait and the "How I build" principles
  experience.tsx        commit graph with a branch lane and a commit-type filter
  projects.tsx          ruled, typographic project index
  skills.tsx            skill groups laid out like a JSON file
  theme-toggle.tsx      dark/light toggle
  status-bar.tsx        editor-style status bar (desktop)
  json-ld.tsx           Person + ProfilePage + WebSite structured data
lib/
  content.ts          all professional content
  site.ts             identity, links, section map
  motion-scenes.ts    the GSAP scroll scenes (lazy chunk)
  lazy-sections.ts    idle-time rendering of sections below the fold
  scroll-store.ts     shared scroll state (active section, progress)
  theme.ts            theme read, apply and change events
```

## How the animation layer works

Motion is layered so the first paint never waits for an animation library.

| Layer | What it covers | How |
| ----- | -------------- | --- |
| Hero entrance | name, role, tagline, editor card | Pure CSS keyframes in `app/globals.css`. Starts with the first frame, needs no JavaScript. |
| Simple reveals | `data-reveal`, `data-stagger` + `data-item`, `data-line`, `data-pop` | CSS transitions. `components/motion.tsx` adds the `in` class with an IntersectionObserver. |
| Scroll scenes | `data-scene`: section headers, commit graph, About statement, portrait, project rows, contact email | GSAP in `lib/motion-scenes.ts`, a separate chunk downloaded on the visitor's first interaction. A scene that scrolls into view before GSAP has arrived falls back to the CSS reveal. |

- **No flash before animation.** An inline script marks the document `data-js` before first paint,
  and CSS holds animated elements at `opacity: 0` (never `visibility` or `display`, so they stay in
  the accessibility tree). If the animation layer has not started after 4 seconds, the mark is
  removed and everything shows.
- **Reduced motion.** With `prefers-reduced-motion: reduce`, no animation runs and nothing is hidden.
  Without JavaScript, all content is visible too.

## Performance notes

- **Sections below the fold** are skipped on the first paint (`content-visibility: auto`, switched on
  by the `data-lazy` mark) and rendered one at a time during idle moments right after load
  (`lib/lazy-sections.ts`). Clicking any in-page link renders everything first, so jumps are exact.
- **GSAP is not in the first-load JavaScript.** It loads on first interaction, and ScrollTrigger only
  starts while the page is not scrolling, because its position measurement would cancel a native
  smooth scroll.
- **Scroll state** (active section, progress bar, status-bar line) comes from one shared listener in
  `lib/scroll-store.ts` and is written to the DOM directly, so nothing re-renders while scrolling.
- **Largest Contentful Paint** is the hero tagline. Its fade starts at opacity 0.01 rather than 0,
  because Chrome does not credit a paint while an element is fully transparent.
- JavaScript and CSS are minified by the Next.js build; no extra minifier is needed.

To audit locally:

```bash
npm run build
```

```bash
npx serve out
```

```bash
npx lighthouse http://localhost:3000 --view
```

## Features

- **Dark / light theme.** Follows the OS on a first visit, then remembers the choice. The switch
  animates as a circular reveal where the browser supports the View Transitions API.
- **Commit graph.** `main` and a freelance branch draw as you scroll; filter commits by
  `feat`, `perf`, `fix`.

## SEO

- Title, description, canonical, Open Graph and Twitter card via the Next.js Metadata API
- `Person`, `ProfilePage` and `WebSite` JSON-LD, built from the same data the page shows
- `sitemap.xml` and `robots.txt` generated at build time
- One `h1`, an `h2` per section, semantic landmarks, descriptive image alt text
- Self-hosted fonts and fixed image dimensions to avoid layout shift

Validate after deploying with Google's Rich Results Test and the Schema Markup Validator. These
make the page easy for search engines to understand; they do not guarantee any ranking.
