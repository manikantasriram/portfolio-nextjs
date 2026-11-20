# Manikanta Sriram, portfolio

Source for my personal site, [manikantasriram.vercel.app](https://manikantasriram.vercel.app).

I'm a full stack developer in Hyderabad. The site is styled like a code editor: each section is a file (`about.md`, `experience.log`, `projects.tsx`, `skills.json`), my work history is drawn as a `git log --graph`, and a status bar at the bottom shows which file you're reading as you scroll.

## Contents

- [What's on the site](#whats-on-the-site)
- [Stack](#stack)
- [Running it locally](#running-it-locally)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Editing content](#editing-content)
- [Adding a photo](#adding-a-photo)
- [Deploying](#deploying)
- [Analytics and Speed Insights](#analytics-and-speed-insights)
- [Security](#security)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [SEO](#seo)
- [Design](#design)

## What's on the site

| Section    | Contents |
| ---------- | -------- |
| Hero       | Name, tagline, resume download and a `main.py` code card |
| About      | Background, portrait and six "How I build" principles |
| Experience | Work history as a commit graph that draws itself as you scroll, filterable by `feat`, `perf` and `fix` |
| Projects   | Each project's description, tech stack (logo and name chips), live demo and source links |
| Skills     | Tools grouped by area as overlapping logos; hover or focus a logo to see its name |
| Education  | Degree and college |
| Frames     | My photography as a horizontal reel with tag filters |
| Contact    | Email (with a copy button), resume, LinkedIn and GitHub |

Every photo also has its own page at `/photos/<slug>` with the full-size original, a download button, previous and next links, and keyboard shortcuts (← and → to browse, Esc to go back). Opening a photo from the reel and going back returns you to the same frame.

The site has a light and a dark theme. It follows your OS setting on the first visit and remembers your choice after that. Switching animates as a circle growing from the toggle where the browser supports the View Transitions API.

## Stack

| Area       | Tools |
| ---------- | ----- |
| Framework  | Next.js 16 (App Router), built as a static export |
| UI         | React 19, TypeScript in strict mode |
| Styling    | Tailwind CSS 4 and hand-written CSS with design tokens for both themes |
| Animation  | CSS for the hero and simple reveals, GSAP 3 with ScrollTrigger and SplitText for the scroll scenes |
| Icons      | lucide-react, plus SVG logos in `public/skills` |
| Fonts      | Space Grotesk, DM Sans and DM Mono, self-hosted through `next/font` |
| Images     | sharp, which generates the WebP copies of each photo |
| Hosting    | Vercel, with Web Analytics and Speed Insights |

## Running it locally

You need Node.js 24 or newer and npm. `.nvmrc` pins Node 26, which is what Vercel builds with.

```bash
git clone https://github.com/manikantasriram/portfolio-nextjs.git
```

```bash
cd portfolio-nextjs
```

```bash
npm install
```

```bash
npm run dev
```

The dev server runs at [http://localhost:3000](http://localhost:3000) and reloads on save.

## Scripts

| Command             | What it does |
| ------------------- | ------------ |
| `npm run dev`       | Starts the dev server |
| `npm run build`     | Builds the static site into `out/` |
| `npm run lint`      | Runs ESLint |
| `npm run typecheck` | Runs `tsc --noEmit` |
| `npm run photos`    | Regenerates the web-sized photo copies |
| `npm run tokens:check` | Checks `design/tokens.json` matches the colours in `app/globals.css` |

To check the production build the way Vercel serves it, with clean URLs such as `/photos/chai`:

```bash
npm run build
```

```bash
npx serve out
```

The Analytics and Speed Insights scripts only exist on Vercel, so a local build logs two 404s for them. That's expected.

## Project structure

```
app/
  layout.tsx          root layout: fonts, metadata, the pre-paint theme script, Analytics, Speed Insights
  page.tsx            the home page, every section in order
  globals.css         design tokens and every component style
  photos/[slug]/      one statically generated page per photo
  not-found.tsx       404 page
  sitemap.ts          /sitemap.xml, including each photo page and its image
  robots.ts           /robots.txt
components/           one file per section (hero, about, experience, projects, skills, photos)
                      plus the nav, footer, status bar, theme toggle and structured data
lib/
  content.ts          all the text: about, experience, projects, skills, education and photos
  site.ts             name, email, links, resume path and the ordered list of sections
  motion-scenes.ts    the GSAP scroll scenes, loaded as their own chunk
  lazy-sections.ts    renders below-the-fold sections after first paint and keeps in-page jumps exact
  scroll-store.ts     one shared scroll listener for the nav progress bar and status bar
  theme.ts            reads, saves and switches the theme
scripts/
  photo-variants.mjs  writes the WebP copies of each photo
public/               resume PDF, social image, skill logos, portrait, photos and security.txt
vercel.json           security headers and cache rules
```

## Editing content

Almost everything you'd change lives in two files.

`lib/content.ts` holds the about text, experience, projects, skills, education, and the photo titles, captions and alt text.

`lib/site.ts` holds the name, email, GitHub and LinkedIn links, the resume path and the section order. The nav, section headers and status bar are all built from its `sections` list.

To update the resume, replace `public/Manikanta_Sriram_Resume.pdf` with a new file of the same name.

Browsers cache images and skill logos for up to a week. If you replace one and returning visitors need to see it straight away, give the new file a different name and update the reference.

## Adding a photo

1. Put the original JPEG in `public/images/photos/full/<slug>.jpg`.
2. Run `npm run photos`. It writes `reel/<slug>-560.webp` and `reel/<slug>-1080.webp` for the reel and `view/<slug>.webp` for the photo page. The original stays untouched for downloads.
3. Add an entry to `photography.photos` in `lib/content.ts` with a title, tag, caption, alt text and the original's width and height.

The reel, the tag filters, the photo page, the sitemap and the previous and next links pick it up from there.

## Deploying

The repository is connected to Vercel. A push to `main` deploys to production, and any other branch or pull request gets a preview URL.

Canonical links, Open Graph tags, the sitemap and the structured data all use one site URL, set in `next.config.ts`. It uses `NEXT_PUBLIC_SITE_URL` when that's set (for a custom domain), otherwise Vercel's production domain, otherwise `https://manikantasriram.vercel.app`.

`public/google9d715ed03759a179.html` verifies the site in Google Search Console. Don't delete it.

## Analytics and Speed Insights

`<Analytics />` and `<SpeedInsights />` in `app/layout.tsx` send page views and real-user loading times to Vercel. Neither sets cookies. The results are on the project's Analytics and Speed Insights tabs in the Vercel dashboard. Vercel ignores headless browsers, and ad blockers can stop your own visits from being counted.

## Security

The site is static. It has no forms, no backend, no login and no user data, so the work is in the response headers. `vercel.json` sends these with every response:

- `Content-Security-Policy`: scripts, styles, images, fonts and requests from the site's own origin only; no plugins, no frames in or out, no workers; forms can only post to the site itself
- `Strict-Transport-Security`: HTTPS only for two years, including subdomains, with preload
- `X-Frame-Options: DENY` and `frame-ancestors 'none'`, so no other site can frame this one
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` and `Cross-Origin-Opener-Policy: same-origin`
- `Permissions-Policy` switching off camera, microphone, location, payments, USB, serial, Bluetooth, HID, screen capture, motion sensors and the Topics API
- `X-DNS-Prefetch-Control: off` and `X-Permitted-Cross-Domain-Policies: none`

`/.well-known/security.txt` gives a contact for reporting problems. External links that open a new tab use `rel="noopener noreferrer"`, and the JSON-LD blocks are serialised with `<` escaped.

The CSP still allows inline scripts, because a Next.js static export inlines its own bootstrap scripts. There's no user input on the site to inject, so the risk is low.

## Accessibility

The target is WCAG 2.2 AA, checked with axe-core, Lighthouse and a keyboard walk in both themes on desktop and phone.

- One `h1`, an `h2` per section, landmarks and a skip link that comes first in the tab order
- Every interactive element has a visible focus ring, and a focused photo in the pinned reel scrolls into view
- Text contrast of 4.5:1 or more in both themes, no visible text below 12px, and targets of at least 24px
- Links that open a new tab say so to screen readers
- No sideways scrolling at 320px wide, and no clipped text with enlarged text spacing
- With `prefers-reduced-motion` nothing animates and nothing is hidden. Without JavaScript, all content is visible.

## Performance

Lighthouse on the production build scores 99 to 100 for performance on mobile and 100 on desktop, with 100 for accessibility, best practices and SEO.

- The hero animates with CSS only, so it shows on first paint. The tagline is the largest paint, and its fade starts at opacity 0.01 because Chrome doesn't count a paint at 0.
- GSAP isn't in the first-load JavaScript. It downloads after your first interaction, and ScrollTrigger waits until the page stops scrolling before it measures.
- Sections below the fold use `content-visibility: auto` and render one at a time during idle moments after load. Clicking an in-page link renders everything first so the jump lands exactly.
- Scroll position feeds the nav and status bar from one listener and is written straight to the DOM, so nothing re-renders while you scroll.
- Photos are WebP at the size each screen needs: 560px or 1080px tall in the reel, and a full-resolution copy on the photo page.

## SEO

- Title, description, canonical URL, Open Graph and Twitter card on every page through the Next.js Metadata API
- `Person`, `ProfilePage` and `WebSite` structured data on the home page, linked to GitHub, LinkedIn and Instagram
- `ImageObject` structured data on each photo page, crediting me as the photographer
- `sitemap.xml` with the home page, all 16 photo pages and their images, and a `robots.txt` that allows everything
- Self-hosted fonts and fixed image dimensions, so nothing shifts while the page loads

After a deploy that changes content, submitting the sitemap again in Search Console gets Google to recrawl it sooner.

## Design

The colours, fonts, type scale, spacing and components are documented in [design/DESIGN.md](design/DESIGN.md), with the same values as data in [design/tokens.json](design/tokens.json). `npm run tokens:check` fails if the colours there drift from `app/globals.css`; CI runs it on every push.
