# Design

The visual rules for [manikantasriram.vercel.app](https://manikantasriram.vercel.app). The values here match `app/globals.css`, which is the source of truth, and `design/tokens.json` holds the same values as data. `npm run tokens:check` (also run in CI) fails if the colours in the two drift apart.

The site is styled like a code editor: each section is a file (`about.md`, `experience.log`, `projects.tsx`, `skills.json`, `photos.raw`, `contact.sh`), work history is a `git log --graph`, and a status bar tracks which file you're reading.

## Colour

Two themes. Light mode sits on pure white and dark mode on pure black, with neutral zinc greys in between. Contrast is measured against the page background; every text colour is at least 4.6:1 on both the page and the card colour, so all of them pass WCAG AA.

| Token | Role | Light | Dark |
| --- | --- | --- | --- |
| `--bg` | Page background | `#ffffff` | `#000000` |
| `--surface` | Cards, code card, chips | `#f7f7f8` | `#0c0c0e` |
| `--line` | Borders and hairline rules | `#e4e4e7` | `#27272a` |
| `--ink` | Headings and body text | `#09090b` · 19.9:1 | `#fafafa` · 20.1:1 |
| `--mute` | Secondary text, captions | `#52525b` · 7.7:1 | `#a1a1aa` · 8.2:1 |
| `--c` | Comments, hashes, labels | `#63636d` · 5.9:1 | `#8a8a93` · 6.1:1 |
| `--acc` | Accent, links, focus ring | `#2563eb` · 5.2:1 | `#60a5fa` · 8.3:1 |
| `--br` | Freelance branch label | `#be123c` · 6.3:1 | `#fb7185` · 7.8:1 |
| `--ok` | Live status | `#15803d` · 5.0:1 | `#4ade80` · 12.1:1 |
| `--warn` | In-progress status | `#b45309` · 5.0:1 | `#fb923c` · 9.3:1 |
| `--k` | Code keywords | `#be123c` | `#fb7185` |
| `--s` | Code strings | `#15803d` | `#4ade80` |
| `--p` | Code properties, JSON keys | `#1d4ed8` · 6.7:1 | `#7dd3fc` · 12.6:1 |
| `--n` | Code numbers | `#a16207` · 4.9:1 | `#fbbf24` · 12.6:1 |

Labels on tinted pills (status badges, branch labels) mix their colour with `--ink` (70 to 80 percent colour) so the text stays readable on the tint. The phone's browser bar follows the chosen theme: `#FFFFFF` in light mode, `#000000` in dark.

## Typography

| Font | Use | Weights |
| --- | --- | --- |
| Space Grotesk | The name, section and project titles, the tagline, the About statement | 500, 700 |
| DM Sans | Body text, buttons, navigation, captions | 400, 500, 700 |
| DM Mono | File names, `//` comments, `$` prompts, the code card, chips, the status bar | 400, 500 |

All three are self-hosted through `next/font`.

| Role | Spec |
| --- | --- |
| Name | Space Grotesk 700, 52 to 128px, line height 0.94, tracking -0.04em |
| Section title | Space Grotesk 700, 32 to 56px, tracking -0.03em |
| Project title | Space Grotesk 700, 26 to 42px, line height 1.1 |
| Tagline | Space Grotesk 700, 24 to 36px, line height 1.18 |
| About statement | Space Grotesk 500, 21 to 32px, line height 1.34 |
| Body | DM Sans 400, 17px (16px under 720px), line height 1.65 |
| Small body | DM Sans 400, 15px, line height 1.6 |
| Labels and code | DM Mono 400, 13 to 15px, never below 12px |

Display sizes are fluid (`clamp`), so the larger number is the desktop size.

## Spacing and shape

- Content sits in one centred column with 24px side padding; the photo reel breaks out edge to edge.
- Sections have 44 to 80px of padding top and bottom.
- Gaps step through 8, 12, 16, 24, 32, 48 and 72px.
- Radii: 16px for cards, 999px for buttons, badges and chips, 5 to 6px for small tags.
- One soft drop shadow for raised cards (`0 28px 56px -32px`), never a coloured glow.

## Components

- **Buttons:** 48px tall pills. Primary is filled with `--ink`; secondary is outlined. Text links use `--acc` with an underline that thickens on hover.
- **Section header:** number and file name, a hairline rule, the title, then a `//` comment.
- **Editor card:** 16px radius, a 42px tab bar with the file name underlined in `--acc`, syntax colours from the `--k --s --p --n --c` tokens.
- **Commit graph:** `main` in `--acc` and the freelance branch in `--br`; each commit has a hash, a type tag and the message.
- **Photo tags and commit filters:** DM Mono 13px chips; the selected photo tag fills with `--acc`.
- **Status badges:** pill with a dot, `--ok` for live and `--warn` for in progress.
- **Tech stack chips:** logo and name in a bordered pill.
- **Skill logos:** overlapping 48px circles; hover or keyboard focus lifts one 4px, scales it 1.12 times, adds an `--acc` ring and shows its name.

## Rules

- Text contrast of 4.5:1 or more in both themes.
- No visible text under 12px.
- Every control at least 24px, and 40px on touch screens.
- A visible focus ring on everything interactive.
- With `prefers-reduced-motion`, nothing animates and nothing is hidden.
- Links that open a new tab (LinkedIn, GitHub, the live demo, source code and Instagram) say so to screen readers.

## Design file

The full desktop and phone pages and a style guide are drawn in a Claude design file. It's private to the owner, who can share it from its Share menu: https://claude.ai/artifact/Atit6zG2NVJq15hq5RWtSs
