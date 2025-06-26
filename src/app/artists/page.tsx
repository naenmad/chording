import React from 'react';
import Link from 'next/link';
import { songAPI } from '@/lib/supabase';

// Types
type Artist = {
  name: string;
  songCount: number;
};

export default async function ArtistsPage() {
  // Fetch artists from database
  const { data: artistsData = [], error } = await songAPI.getAllArtists();

  // Get genres from database for filter
  const { data: genresData = [] } = await songAPI.getGenresWithCount();

  // Create genres filter array
  const genres = ['Semua', ...genresData.map(g => g.name)];

  // Add some fallback artists if none in database
  const artists = artistsData.length > 0 ? artistsData : [
    { name: 'Tulus', songCount: 0 },
    { name: 'Raisa', songCount: 0 },
    { name: 'Noah', songCount: 0 },
    { name: 'Dewa 19', songCount: 0 },
  ];

  return (
    <div className="bg-[#E0E8EF] min-h-screen">
      {/* Header Section */}
      <section className="bg-[#1A2A3A] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Daftar Artis
            <span className="text-[#00FFFF]">.</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Temukan chord lagu dari artis favoritmu di berbagai genre musik.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                className={`px-4 py-2 rounded-md font-medium ${genre === 'Semua' ? 'bg-[#1A2A3A] text-white' : 'bg-gray-100 text-[#1A2A3A] hover:bg-gray-200'}`}
              >
                {genre}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Cari artis..."
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
            />
          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artists && artists.length > 0 ? (
              artists.map((artist, index) => (
                <Link
                  href={`/artists/${artist.name.toLowerCase().replace(/\s+/g, '-')}`}
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
                >
                  <div className="bg-[#1A2A3A] h-32 flex items-center justify-center">
                    {/* Placeholder for artist image */}
                    <span className="text-4xl text-[#00FFFF] font-bold">
                      {artist.name.charAt(0)}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#1A2A3A] group-hover:text-[#00FFFF] transition-colors mb-1">
                      {artist.name}
                    </h3>
                    <span className="inline-block bg-[#E0E8EF] text-[#1A2A3A] text-xs px-3 py-1 rounded-full">
                      {artist.songCount} lagu
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              // Loading skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="bg-gray-200 h-32 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="p-6">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-[#B0A0D0] bg-opacity-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#1A2A3A]">
            Tidak menemukan artis yang Anda cari?
          </h2>
          <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
            Gunakan fitur pencarian atau jelajahi genre untuk menemukan lebih banyak artis dan chord lagu.
          </p>
          <Link
            href="/genre"
            className="inline-block px-8 py-4 bg-[#00FFFF] text-[#1A2A3A] rounded-md font-bold hover:bg-[#1A2A3A] hover:text-white transition-colors"
          >
            Jelajahi Genre
          </Link>
        </div>
      </section>
    </div>
  );
}

