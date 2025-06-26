'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { songAPI } from '@/lib/supabase';

// Types
type SearchResult = {
  id: string;
  slug?: string;
  title: string;
  artist_name: string;
  difficulty: string;
  genre_name: string;
  view_count: number;
};

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const { data, error } = await songAPI.searchSongs(searchTerm.trim(), 50);

      if (error) {
        setError('Gagal melakukan pencarian');
        return;
      }

      setResults(data || []);
    } catch (err) {
      console.error('Search error:', err);
      setError('Terjadi kesalahan saat pencarian');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update URL without page reload
      const url = new URL(window.location.href);
      url.searchParams.set('q', searchQuery.trim());
      window.history.pushState({}, '', url);

      performSearch(searchQuery.trim());
    }
  };

  return (
    <div className="bg-[#E0E8EF] min-h-screen">
      {/* Header Section */}
      <section className="bg-[#1A2A3A] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-[#00FFFF] transition-colors">
                    Beranda
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-[#00FFFF]">Pencarian</li>
              </ol>
            </nav>
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Hasil Pencarian
            <span className="text-[#00FFFF]">.</span>
          </h1>
          {query && (
            <p className="text-xl text-gray-300">
              Menampilkan hasil untuk: <span className="text-[#00FFFF]">&ldquo;{query}&rdquo;</span>
            </p>
          )}
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari judul lagu, artis, atau genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-4 px-6 pr-16 rounded-lg border-2 border-[#1A2A3A] bg-white text-[#1A2A3A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF] text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 rounded-md bg-[#00FFFF] text-[#1A2A3A] font-medium hover:bg-[#B0A0D0] transition-colors"
              >
                Cari
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FFFF] mx-auto mb-4"></div>
              <p className="text-[#1A2A3A]">Mencari...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">{error}</p>
              <button
                onClick={() => performSearch(searchQuery)}
                className="mt-4 px-6 py-2 bg-[#00FFFF] text-[#1A2A3A] rounded-md hover:bg-[#B0A0D0] transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {!loading && !error && hasSearched && (
            <>
              <div className="mb-8">
                <p className="text-lg text-[#1A2A3A]">
                  Ditemukan <span className="font-bold text-[#00FFFF]">{results.length}</span> hasil
                  {query && <span> untuk &ldquo;{query}&rdquo;</span>}
                </p>
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((song) => (
                    <Link
                      key={song.id}
                      href={`/chord/${song.slug || song.id}`}
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1 border-t-4 border-[#00FFFF]"
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-[#1A2A3A] mb-2 line-clamp-2">
                          {song.title}
                        </h3>
                        <p className="text-gray-600 mb-2">{song.artist_name}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <span className="inline-block bg-[#E0E8EF] text-[#1A2A3A] text-sm px-3 py-1 rounded-full">
                              {song.difficulty}
                            </span>
                            <span className="inline-block bg-[#B0A0D0] text-white text-sm px-3 py-1 rounded-full">
                              {song.genre_name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {song.view_count?.toLocaleString()} views
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-[#1A2A3A] mb-4">
                    Tidak Ada Hasil Ditemukan
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Maaf, tidak ada chord yang cocok dengan pencarian &ldquo;{query}&rdquo;.
                    Coba gunakan kata kunci yang berbeda atau lebih spesifik.
                  </p>

                  <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                    <h4 className="font-semibold text-[#1A2A3A] mb-3">Tips Pencarian:</h4>
                    <ul className="text-sm text-gray-600 space-y-1 text-left">
                      <li>• Periksa ejaan kata kunci</li>
                      <li>• Gunakan kata kunci yang lebih umum</li>
                      <li>• Coba cari berdasarkan nama artis</li>
                      <li>• Coba cari berdasarkan genre musik</li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}

          {!hasSearched && !query && (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🎵</div>
              <h3 className="text-3xl font-bold text-[#1A2A3A] mb-4">
                Cari Chord Lagu Favorit
              </h3>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Masukkan judul lagu, nama artis, atau genre untuk menemukan chord yang Anda cari.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Searches */}
      {!hasSearched && (
        <section className="py-16 px-4 bg-[#1A2A3A] text-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Pencarian Populer
              <span className="text-[#00FFFF] ml-2">🔥</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                'Sheila On 7',
                'Peterpan',
                'Noah',
                'Iwan Fals',
                'Dewa 19',
                'Ungu',
                'Pop',
                'Rock'
              ].map((term, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(term);
                    performSearch(term);
                  }}
                  className="bg-[#2A3A4A] p-4 rounded-lg text-center hover:bg-[#3A4A5A] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#E0E8EF] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FFFF] mx-auto mb-4"></div>
          <p className="text-[#1A2A3A]">Memuat...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
