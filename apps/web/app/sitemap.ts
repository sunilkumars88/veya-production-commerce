import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/collections/best-sellers`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/collections/new-arrivals`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/category/bras`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/category/panties`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/pages/contact`, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
