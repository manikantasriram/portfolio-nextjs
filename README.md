# Manikanta Sriram · Portfolio

My personal portfolio site, built and maintained by me.

**Live:** [manikantasriram.vercel.app](https://manikantasriram.vercel.app)

The site is styled like a code editor. Each section is a "file" (`about.md`, `experience.log`,
`projects.tsx`, `skills.json`), experience is shown as a `git log`, and a status bar at the bottom
tracks which file you're in as you scroll.

## Contents

- [What's on the site](#whats-on-the-site)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Updating content](#updating-content)
- [Adding a photo](#adding-a-photo)
- [Deployment](#deployment)
- [Analytics](#analytics)
- [Security](#security)
- [Accessibility and performance](#accessibility-and-performance)

## What's on the site

| Section    | What it shows                                                                  |
| ---------- | ------------------------------------------------------------------------------ |
| Hero       | Name, tagline, resume download and a `main.py` code card                       |
| About      | Background, portrait and six "How I build" principles                          |
| Experience | Work history as a commit graph, filterable by commit type (`feat`, `perf`, `fix`) |
| Projects   | Project descriptions, tech stack, live demo and source links                   |
| Skills     | Tools grouped like a JSON file, with logos and names                           |
| Education  | Degree and college                                                             |
| Frames     | A scrolling reel of my photography, with tag filters and a page per photo      |
| Contact    | Email, resume, LinkedIn and GitHub                                             |

Other features:

- Light and dark theme. It follows the OS setting on a first visit and remembers your choice.
- Each photo has its own page (`/photos/<name>`) with the full-size original and a download button.
- Works without JavaScript, and nothing animates if you've turned on reduced motion.

## Tech stack

| Area       | Tools                                                         |
| ---------- | ------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router), exported as a static site            |
| Language   | TypeScript (strict mode)                                      |
| UI         | React 19                                                      |
| Styling    | Tailwind CSS 4, plus design tokens (CSS variables) for both themes |
| Animation  | CSS for simple effects; GSAP + ScrollTrigger for scroll scenes |
| Icons      | lucide-react                                                  |
| Fonts      | Space Grotesk, DM Sans and DM Mono, self-hosted via `next/font` |
| Images     | sharp, to generate WebP versions of the photos                |
| Hosting    | Vercel                                                        |
| Analytics  | Vercel Web Analytics                                          |

## Getting started

You'll need **Node.js 24 or newer** (`.nvmrc` pins 26, which is what Vercel builds with) and npm.

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

Then open [http://localhost:3000](http://localhost:3000). Changes reload automatically.

## Scripts

| Command             | What it does                                                   |
| ------------------- | -------------------------------------------------------------- |
| `npm run dev`       | Starts the dev server on port 3000                             |
| `npm run build`     | Builds the static site into `out/`                             |
| `npm run lint`      | Runs ESLint                                                    |
| `npm run typecheck` | Runs the TypeScript compiler without emitting files            |
| `npm run photos`    | Regenerates the web-sized photo copies (see [Adding a photo](#adding-a-photo)) |

To preview the production build locally:

```bash
npm run build
```

```bash
npx serve out
```

## Project structure

```
app/
  layout.tsx          root layout: fonts, metadata, theme script, analytics
  page.tsx            the home page, all sections in order
  globals.css         design tokens and all component styles
  photos/[slug]/      one page per photo
  not-found.tsx       404 page
  sitemap.ts          generates /sitemap.xml
  robots.ts           generates /robots.txt
components/           one file per section (hero, about, experience, projects, skills, photos...)
                      plus the nav, footer, status bar and theme toggle
lib/
  content.ts          all the text: about, experience, projects, skills, education, photos
  site.ts             name, email, links, resume path and the list of sections
  motion-scenes.ts    GSAP scroll animations, loaded as a separate chunk
  lazy-sections.ts    renders below-the-fold sections after the first paint
  scroll-store.ts     one shared scroll listener for the nav and status bar
  theme.ts            reading, saving and switching the theme
scripts/
  photo-variants.mjs  creates the WebP copies of each photo
public/               resume PDF, social image, skill icons, portrait and photos
vercel.json           security headers and cache rules
```

## Updating content

Almost everything you'd want to change lives in two files:

- **`lib/content.ts`**: about text, experience, projects, skills, education and photo captions.
- **`lib/site.ts`**: name, email, GitHub and LinkedIn links, the resume path and the section order.
  The nav, section headers and status bar are all built from the section list here.

To update the resume, replace `public/Manikanta_Sriram_Resume.pdf` with a new file of the same name.

Images and skill icons are cached by browsers for up to a week, so give a replaced image a new
file name (and update the reference) if returning visitors need to see the change right away.

## Adding a photo

1. Put the original JPEG in `public/images/photos/full/<slug>.jpg`.
2. Run `npm run photos` to create the reel and photo-page versions.
3. Add an entry to the `photos` list in `lib/content.ts` with a title, tag, caption, alt text and the
   original's width and height.

The reel, filters, photo page, sitemap and previous/next links pick it up automatically.

## Deployment

The site deploys to Vercel from GitHub:

- Pushing to `main` deploys to production.
- Any other branch or pull request gets its own preview URL.

Vercel builds the static export and serves it from its CDN. The site URL used for canonical links,
Open Graph tags, the sitemap and structured data is set in `next.config.ts`:

1. `NEXT_PUBLIC_SITE_URL`, if it's set (use this for a custom domain)
2. otherwise Vercel's production domain
3. otherwise `https://manikantasriram.vercel.app`

`public/google9d715ed03759a179.html` is the Google Search Console verification file, so don't delete it.

## Analytics

Page views are tracked with Vercel Web Analytics (the `<Analytics />` component in
`app/layout.tsx`). There are no cookies. Results are in the Vercel dashboard under the project's
**Analytics** tab. Visits blocked by ad blockers or made by headless browsers aren't counted.

## Security

`vercel.json` sets these headers on every response:

- Content-Security-Policy (only same-origin scripts, styles, images and fonts; no framing)
- Strict-Transport-Security (HTTPS only, two years, preload)
- X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Cross-Origin-Opener-Policy
- Permissions-Policy (camera, microphone and location turned off)

The site has no forms, no backend and no user data. All external links use `rel="noopener"`.

## Accessibility and performance

- Aims for WCAG 2.2 AA: semantic HTML, a skip link, visible focus rings, colour contrast of 4.5:1
  or more in both themes, 24px minimum targets, and no text smaller than 12px.
- Checked with axe-core and Lighthouse (100 for accessibility, best practices and SEO).
- The hero animates with CSS only, so it shows on the first paint. GSAP downloads after your first
  interaction and isn't part of the initial JavaScript.
- Sections below the fold use `content-visibility: auto` and are rendered during idle time after load.
- Photos are served as WebP, at the size each screen needs.
