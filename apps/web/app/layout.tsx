import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SakhiKart — Shop Innerwear, Period Care, Baby & Wellness',
  description: 'India’s essentials marketplace for innerwear, period care, hygiene, baby and wellness. COD and Razorpay ready. Dropship fulfilment. Sell with us soon.',
  openGraph: {
    title: 'SakhiKart — India’s essentials marketplace',
    description: 'Innerwear, period care, baby, hygiene and wellness. One cart, pan-India delivery.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:ital,wght@0,600;1,600&display=swap" rel="stylesheet" />
      </head>
      <body className="relative antialiased">{children}</body>
    </html>
  );
}
