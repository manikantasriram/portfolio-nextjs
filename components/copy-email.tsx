"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Copies the email address. `compact` renders a small icon-only button (used next to the address
 * under the contact form); otherwise a full "Copy email" button.
 */
export function CopyEmail({ email, compact = false }: { email: string; compact?: boolean }) {
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

  const icon = copied ? (
    <Check className="i-pop" strokeWidth={2.4} aria-hidden="true" />
  ) : (
    <Copy strokeWidth={2} aria-hidden="true" />
  );

  if (compact) {
    return (
      <button
        type="button"
        className="copy-ic"
        onClick={copy}
        data-copied={copied}
        aria-label="Copy email address"
        data-tip={copied ? "Copied" : "Copy"}
      >
        {icon}
        <span className="sr-only" aria-live="polite">
          {copied ? "Copied" : ""}
        </span>
      </button>
    );
  }

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
      {icon}
    </button>
  );
}
