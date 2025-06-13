import React from 'react';
import Link from 'next/link';

export default function ArtistsPage() {
  // Placeholder artist data
  const artists = [
    { id: 1, name: 'Tulus', genre: 'Pop', songCount: 24 },
    { id: 2, name: 'Raisa', genre: 'Pop', songCount: 19 },
    { id: 3, name: 'Noah', genre: 'Rock', songCount: 17 },
    { id: 4, name: 'Dewa 19', genre: 'Rock', songCount: 22 },
    { id: 5, name: 'Iwan Fals', genre: 'Folk', songCount: 30 },
    { id: 6, name: 'Slank', genre: 'Rock', songCount: 15 },
    { id: 7, name: 'Via Vallen', genre: 'Dangdut', songCount: 12 },
    { id: 8, name: 'Sheila On 7', genre: 'Pop', songCount: 18 },
    { id: 9, name: 'Nidji', genre: 'Pop', songCount: 10 },
    { id: 10, name: 'Andra & The Backbone', genre: 'Rock', songCount: 8 },
    { id: 11, name: 'Rhoma Irama', genre: 'Dangdut', songCount: 14 },
    { id: 12, name: 'Jamrud', genre: 'Rock', songCount: 11 },
  ];

  // Placeholder genre filter
  const genres = ['Semua', 'Pop', 'Rock', 'Dangdut', 'Folk', 'Jazz', 'Alternative'];

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
            {artists.map((artist) => (
              <Link
                href={`/artists/${artist.name.toLowerCase().replace(/\s+/g, '-')}`}
                key={artist.id}
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
                  <p className="text-gray-500 text-sm mb-2">Genre: {artist.genre}</p>
                  <span className="inline-block bg-[#E0E8EF] text-[#1A2A3A] text-xs px-3 py-1 rounded-full">
                    {artist.songCount} lagu
                  </span>
                </div>
              </Link>
            ))}
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

