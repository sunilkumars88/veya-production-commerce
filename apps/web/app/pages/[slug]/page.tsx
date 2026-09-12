'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { api } from '../../../lib/api';

export default function ContentPage() {
  const { slug } = useParams();
  const [page, setPage] = useState<any>(null);

  useEffect(() => {
    if (slug) api.getPage(slug as string).then(setPage).catch(() => {});
  }, [slug]);

  return (
    <>
      <Header />
      <main className="max-w-[800px] mx-auto px-4 py-8 md:py-12">
        <h1 className="font-serif text-3xl md:text-4xl">{page?.title || 'Page'}</h1>
        <div className="mt-6 prose prose-sm text-black/70 leading-relaxed whitespace-pre-wrap">{page?.content || 'Loading...'}</div>
      </main>
      <Footer />
    </>
  );
}
