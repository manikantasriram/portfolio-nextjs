import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 | Manikanta Sriram",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="wrap flex min-h-[80vh] flex-col justify-center py-20">
      <p className="kick">
        <b>$</b>cd ~/this-page
      </p>
      <h1 className="text-[length:var(--h2)]">404: no such file or directory</h1>
      <p className="meta mt-3">The page you were looking for doesn&apos;t exist.</p>
      <div className="cta">
        <Link className="btn main" href="/">
          cd ~
        </Link>
      </div>
    </main>
  );
}
