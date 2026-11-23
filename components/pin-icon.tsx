/**
 * Push-pin location marker: a red ball with a highlight on a thin needle. The needle follows
 * `currentColor` so it stays visible in both themes. Decorative.
 */
export function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="7.5" r="5.8" fill="#DC3530" />
      <circle cx="9.9" cy="5.4" r="1.5" fill="#F87171" />
    </svg>
  );
}
