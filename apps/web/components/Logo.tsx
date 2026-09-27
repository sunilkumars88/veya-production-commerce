import Link from 'next/link';

export const BRAND = {
  name: 'Body, Baby, Bloom',
  short: 'BBB',
  tagline: 'She changes. Baby grows. You still bloom.',
};

function BloomMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="32" cy="32" r="31" fill="#E8F4F2" />
      <path d="M32 14c4.2 7.4 4.6 14.2 0 22-4.6-7.8-4.2-14.6 0-22Z" fill="#1A7A6E" />
      <path d="M46 38c-8.4-2.2-14.6.2-18.5 8.6 8.2 1.6 14.8-1.2 18.5-8.6Z" fill="#2A9D8F" />
      <path d="M18 38c8.4-2.2 14.6.2 18.5 8.6-8.2 1.6-14.8-1.2-18.5-8.6Z" fill="#E8B4B8" />
      <circle cx="32" cy="34" r="4.2" fill="#0D1E1C" />
      <circle cx="32" cy="34" r="2" fill="#F4FAFA" />
    </svg>
  );
}

export default function Logo({
  href = '/',
  showTagline = false,
  compact = false,
  inverted = false,
}: {
  href?: string;
  showTagline?: boolean;
  compact?: boolean;
  inverted?: boolean;
}) {
  const title = inverted ? 'text-white' : 'text-ink';
  const bloom = inverted ? 'text-teal-light' : 'text-teal';
  const tag = inverted ? 'text-white/65' : 'text-ink-mute';

  const inner = (
    <span className="inline-flex items-center gap-2.5 min-w-0">
      <BloomMark size={compact ? 32 : 40} />
      <span className="leading-tight min-w-0">
        <span className={`block font-semibold tracking-tight ${compact ? 'text-[15px] md:text-lg' : 'text-lg md:text-xl'} ${title}`}>
          body baby <span className={`${bloom} font-serif italic font-semibold`}>bloom</span>
        </span>
        {showTagline && (
          <span className={`hidden sm:block text-[10px] md:text-[11px] tracking-[0.02em] mt-0.5 ${tag}`}>
            {BRAND.tagline}
          </span>
        )}
      </span>
    </span>
  );

  if (!href) return inner;
  return (
    <Link href={href} className="shrink-0" aria-label={`${BRAND.name}. ${BRAND.tagline}`}>
      {inner}
    </Link>
  );
}
