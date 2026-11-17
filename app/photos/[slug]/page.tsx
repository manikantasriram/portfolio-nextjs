import { statSync } from "node:fs";
import { join } from "node:path";
import { ArrowLeft, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhotoKeys } from "@/components/photo-keys";
import { photography } from "@/lib/content";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return photography.photos.map((p) => ({ slug: p.slug }));
}

const find = (slug: string) => photography.photos.findIndex((p) => p.slug === slug);
const fullSrc = (slug: string) => `/images/photos/full/${slug}.jpg`;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = photography.photos[find(slug)];
  if (!p) return {};
  return {
    title: `${p.title} | Photo by ${site.name}`,
    description: p.caption,
    alternates: { canonical: `/photos/${slug}` },
    openGraph: {
      title: `${p.title} | Photo by ${site.name}`,
      description: p.caption,
      url: `/photos/${slug}`,
      images: [{ url: fullSrc(slug), width: p.full.width, height: p.full.height, alt: p.alt }],
    },
    twitter: { card: "summary_large_image", images: [fullSrc(slug)] },
  };
}

/** File size of the original, read at build time. */
function sizeOf(slug: string) {
  const bytes = statSync(join(process.cwd(), "public", fullSrc(slug))).size;
  return bytes >= 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : `${Math.round(bytes / 1e3)} KB`;
}

/** One photo, full size, opened from the photo sheet in a new tab. */
export default async function PhotoPage({ params }: Params) {
  const { slug } = await params;
  const { photos, instagram } = photography;
  const i = find(slug);
  if (i < 0) notFound();
  const p = photos[i];
  const prev = photos[(i - 1 + photos.length) % photos.length];
  const next = photos[(i + 1) % photos.length];
  const num = String(i + 1).padStart(2, "0");

  return (
    <main className="pv">
      <header className="pv-bar">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full load lands on #photos exactly */}
        <a href="/#photos" className="pv-back">
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" /> cd ~/photos
        </a>
        <span className="pv-path" aria-hidden="true">
          ~/photos/{slug}.jpg
        </span>
        <span className="pv-count">
          {i + 1} / {photos.length}
        </span>
      </header>

      <div className="pv-body">
        <figure className="pv-stage">
          <a href={fullSrc(slug)} target="_blank" rel="noopener" title="Open the original at 100%">
            {/* eslint-disable-next-line @next/next/no-img-element -- full-resolution WebP copy; the link opens the original JPEG */}
            <img
              src={`/images/photos/view/${slug}.webp`}
              width={p.full.width}
              height={p.full.height}
              alt={p.alt}
              fetchPriority="high"
              decoding="async"
            />
          </a>
        </figure>

        <aside className="pv-info">
          <p className="pv-tag">
            IMG_{num} · {p.tag}
          </p>
          <h1>{p.title}</h1>
          <p className="pv-cap">{p.caption}</p>

          <dl className="pv-meta">
            <div>
              <dt>resolution</dt>
              <dd>
                {p.full.width} × {p.full.height}
              </dd>
            </div>
            <div>
              <dt>file</dt>
              <dd>JPEG · {sizeOf(slug)}</dd>
            </div>
            <div>
              <dt>by</dt>
              <dd>{site.name}</dd>
            </div>
          </dl>

          <div className="pv-cta">
            <a className="btn main" href={fullSrc(slug)} download={`manikanta-sriram-${slug}.jpg`}>
              Download original <Download className="i-down" strokeWidth={2} aria-hidden="true" />
            </a>
            <a className="btn" href={fullSrc(slug)} target="_blank" rel="noopener">
              View at 100% <ArrowUpRight className="i-out" strokeWidth={2} aria-hidden="true" />
            </a>
          </div>

          <nav className="pv-nav" aria-label="More photos">
            <a href={`/photos/${prev.slug}`} rel="prev">
              <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
              <span>
                <small>previous</small>
                {prev.title}
              </span>
            </a>
            <a href={`/photos/${next.slug}`} rel="next">
              <span>
                <small>next</small>
                {next.title}
              </span>
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          </nav>

          <a className="pv-ig" href={instagram.url} target="_blank" rel="noopener noreferrer me">
            More frames on Instagram <b>@{instagram.handle}</b>
            <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
          </a>
          <p className="pv-keys" aria-hidden="true">
            ← → to browse · esc to go back
          </p>
        </aside>
      </div>
      <PhotoKeys prev={`/photos/${prev.slug}`} next={`/photos/${next.slug}`} back="/#photos" />
    </main>
  );
}
