"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard blocked: fall back to opening the mail client.
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      className="btn copy"
      onClick={copy}
      data-copied={copied}
      data-item=""
      data-magnetic=""
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
      {copied ? (
        <Check className="i-pop" strokeWidth={2.4} aria-hidden="true" />
      ) : (
        <Copy strokeWidth={2} aria-hidden="true" />
      )}
    </button>
  );
}
