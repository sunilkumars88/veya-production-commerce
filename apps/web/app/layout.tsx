import './globals.css';
import type { Metadata } from 'next';

const TITLE = 'Body, Baby, Bloom';
const TAGLINE = 'She changes. Baby grows. You still bloom.';

export const metadata: Metadata = {
  title: `${TITLE} — ${TAGLINE}`,
  description: `${TAGLINE} Shop innerwear, period care, hygiene, baby and wellness in India. COD and Razorpay ready.`,
  icons: { icon: '/mark.svg', apple: '/mark.png' },
  openGraph: {
    title: TITLE,
    description: TAGLINE,
    type: 'website',
    images: [{ url: '/logo.png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,500;0,6..96,600;1,6..96,500;1,6..96,600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:ital,wght@0,600;1,600&display=swap" rel="stylesheet" />
      </head>
      <body className="relative antialiased">{children}</body>
    </html>
  );
}
