import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Veya — Everyday Comfort, Elevated',
  description: 'Premium comfortwear and innerwear designed for repeat everyday wear. Shop bras, panties, period care, activewear and more.',
  openGraph: { title: 'Veya — Everyday Comfort, Elevated', description: 'Premium comfortwear and innerwear', type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-[Inter,sans-serif] antialiased">{children}</body>
    </html>
  );
}
