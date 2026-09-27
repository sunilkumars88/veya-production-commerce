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
  variant = 'default',
}: {
  href?: string;
  showTagline?: boolean;
  compact?: boolean;
  inverted?: boolean;
  variant?: 'default' | 'header';
}) {
  const title = inverted ? 'text-white' : 'text-ink';
  const bloom = inverted ? 'text-teal-light' : 'text-teal';
  const tag = inverted ? 'text-white/65' : 'text-ink-mute';
  const isHeader = variant === 'header';

  const inner = isHeader ? (
    <span className="relative flex flex-col items-start leading-none select-none pr-1">
      <span className="flex items-end gap-1.5 z-10 mb-[-3px] md:mb-[-5px]">
        <span className="font-sticker font-extrabold text-[8px] md:text-[11px] bg-[#0D1E1C] text-white px-1.5 md:px-2.5 py-[3px] rounded-md -rotate-6 tracking-[0.12em] shadow-sm">
          BODY
        </span>
        <span className="font-sticker font-extrabold text-[8px] md:text-[11px] bg-[#1A7A6E] text-white px-1.5 md:px-2.5 py-[3px] rounded-md rotate-[8deg] tracking-[0.12em] shadow-sm">
          BABY
        </span>
      </span>
      <span className="font-fun font-bold text-[2rem] md:text-[2.55rem] text-[#1A7A6E] tracking-[-0.03em] flex items-center drop-shadow-[0_1px_0_#fff]">
        BLOOM
        <span className="ml-1 text-[#E8B4B8] text-[1.05rem] md:text-[1.3rem] -rotate-12" aria-hidden>♥</span>
      </span>
      {showTagline && (
        <span className="mt-1 max-w-[220px] md:max-w-none bg-[#0D1E1C] text-white font-sticker font-extrabold text-[7.5px] md:text-[10px] leading-tight px-2.5 py-1 rounded-full tracking-[0.01em]">
          She changes. Baby grows. You still bloom.
        </span>
      )}
    </span>
  ) : (
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
