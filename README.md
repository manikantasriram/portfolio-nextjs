# Portfolio

My personal site: [manikantasriram.vercel.app](https://manikantasriram.vercel.app)

Next.js 16 (App Router, static export), TypeScript, Tailwind CSS 4 and GSAP. Hosted on Vercel.

## Running it

Needs Node 26 (see `.nvmrc`; 24 works too).

```bash
npm install
```

```bash
npm run dev
```

Other scripts:

- `npm run lint` / `npm run typecheck`
- `npm run build` writes the static site to `out/` (`npx serve out` to preview it)
- `npm run photos` regenerates the web-sized photo copies after adding a photo

## Deploying

Pushing to `main` deploys to production on Vercel. Other branches get preview URLs. `vercel.json`
has the security headers (CSP, HSTS etc.) and cache rules.

The site URL used for canonical links, Open Graph, the sitemap and JSON-LD is resolved in
`next.config.ts`: `NEXT_PUBLIC_SITE_URL` if set, otherwise Vercel's production domain.

## Where things live

- `lib/content.ts`: all the text (about, experience, projects, skills, education, photos)
- `lib/site.ts`: name, links, resume path and the section list that drives the nav and headers
- `app/globals.css`: design tokens for both themes and all component styles
- `lib/motion-scenes.ts`: GSAP scroll animations, loaded as a separate chunk
- `public/`: resume PDF, OG image, skill icons, photos

`public/google9d715ed03759a179.html` is the Search Console verification file, so don't delete it.
Images and icons are cached for a long time, so give a replaced file a new name.

## Notes

- The hero animates with plain CSS so it shows on the first paint. GSAP only loads after the first
  interaction, and ScrollTrigger waits until the page stops scrolling before it measures.
- Sections below the fold use `content-visibility: auto` and get rendered during idle time after load.
- With `prefers-reduced-motion` nothing animates and nothing is hidden. Without JavaScript everything
  is still visible.
