import React from 'react';
import Link from 'next/link';

export default function GenrePage() {
  // Sample genre data with icons and counts
  const genres = [
    { id: 1, name: "Pop", count: 120, icon: "🎵" },
    { id: 2, name: "Rock", count: 85, icon: "🎸" },
    { id: 3, name: "Dangdut", count: 64, icon: "🎤" },
    { id: 4, name: "Jazz", count: 42, icon: "🎷" },
    { id: 5, name: "Folk", count: 37, icon: "🪕" },
    { id: 6, name: "Alternative", count: 29, icon: "🎹" },
    { id: 7, name: "Metal", count: 26, icon: "🤘" },
    { id: 8, name: "Reggae", count: 23, icon: "🌴" },
    { id: 9, name: "Electronic", count: 21, icon: "🎛️" },
    { id: 10, name: "R&B", count: 19, icon: "🎙️" },
    { id: 11, name: "Hip Hop", count: 18, icon: "🎧" },
    { id: 12, name: "Classical", count: 15, icon: "🎻" },
    { id: 13, name: "Indie", count: 14, icon: "🎭" },
    { id: 14, name: "Country", count: 12, icon: "🤠" },
    { id: 15, name: "Blues", count: 10, icon: "🎺" },
  ];

  // Featured artists for each genre (sample data)
  const featuredArtists = {
    "Pop": ["Tulus", "Raisa", "Rizky Febian"],
    "Rock": ["Slank", "Dewa 19", "Jamrud"],
    "Dangdut": ["Rhoma Irama", "Via Vallen", "Nella Kharisma"],
    "Jazz": ["Indra Lesmana", "Dwiki Dharmawan", "Eva Celia"]
  };

  return (
    <div className="bg-[#E0E8EF] min-h-screen">
      {/* Header Section */}
      <section className="bg-[#1A2A3A] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Genre Musik
            <span className="text-[#00FFFF]">.</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Jelajahi berbagai genre musik dan temukan chord lagu favorit sesuai selera Anda.
          </p>
        </div>
      </section>

      {/* Genre Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {genres.map((genre) => (
              <Link
                href={`/genre/${genre.id}`}
                key={genre.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
              >
                <div className="bg-[#1A2A3A] p-8 flex justify-center items-center">
                  <span className="text-4xl">{genre.icon}</span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-[#1A2A3A] group-hover:text-[#00FFFF] transition-colors">
                      {genre.name}
                    </h3>
                    <span className="text-[#00FFFF] font-bold">{genre.count}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">lagu tersedia</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Genres Spotlight */}
      <section className="py-16 px-4 bg-[#1A2A3A] text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 flex items-center">
            Genre Terpopuler
            <span className="ml-2 text-[#00FFFF]">♪</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(featuredArtists).slice(0, 4).map(([genre, artists]) => (
              <div key={genre} className="bg-[#2A3A4A] p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  {genre}
                  <div className="ml-3 h-1 w-6 bg-[#00FFFF]"></div>
                </h3>
                <ul className="space-y-2">
                  {artists.map((artist, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-[#3A4A5A] last:border-0"
                    >
                      <span>{artist}</span>
                      <Link
                        href={`/artists/${artist.toLowerCase().replace(' ', '-')}`}
                        className="text-[#00FFFF] hover:text-[#B0A0D0] text-sm transition-colors"
                      >
                        Lihat Lagu
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/genre/${genre.toLowerCase().replace(' ', '-')}`}
                  className="inline-block mt-6 text-[#00FFFF] hover:text-[#B0A0D0] transition-colors text-sm font-medium"
                >
                  Lihat semua artis {genre} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search by Genre */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#E0E8EF] to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#1A2A3A]">
            Cari Lagu Berdasarkan Genre
          </h2>
          <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
            Pilih genre dan tentukan artis favorit untuk menemukan chord lagu yang Anda cari.
          </p>
          <div className="flex flex-col md:flex-row md:space-x-4 justify-center items-center space-y-4 md:space-y-0">
            <select className="w-full md:w-64 px-4 py-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF]">
              <option value="">Pilih Genre</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
            <select className="w-full md:w-64 px-4 py-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF]">
              <option value="">Pilih Artis</option>
              <option value="all">Semua Artis</option>
              {["Tulus", "Raisa", "Noah", "Dewa 19", "Rizky Febian"].map((artist, index) => (
                <option key={index} value={artist.toLowerCase().replace(' ', '-')}>{artist}</option>
              ))}
            </select>
            <button className="w-full md:w-auto px-8 py-3 bg-[#00FFFF] text-[#1A2A3A] rounded-md font-medium hover:bg-[#B0A0D0] transition-colors">
              Temukan Chord
            </button>
          </div>
        </div>
      </section>

      {/* Genre Learning */}
      <section className="py-16 px-4 bg-[#B0A0D0] bg-opacity-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#1A2A3A]">
                Pelajari Karakteristik Genre
                <span className="text-[#00FFFF]">.</span>
              </h2>
              <p className="text-lg mb-6 text-gray-700">
                Setiap genre musik memiliki karakteristik unik dalam penggunaan chord.
                Pelajari ciri khas masing-masing genre untuk meningkatkan kemampuan bermain gitar Anda.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="text-[#00FFFF] mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Pop menggunakan chord dasar yang lebih sederhana dan mudah dipelajari</span>
                </li>
                <li className="flex items-start">
                  <div className="text-[#00FFFF] mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Rock sering menggunakan power chord dan distorsi</span>
                </li>
                <li className="flex items-start">
                  <div className="text-[#00FFFF] mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Jazz memiliki chord yang lebih kompleks dengan ekstensi dan alterasi</span>
                </li>
              </ul>
              <Link
                href="/tutorials"
                className="inline-block px-6 py-3 bg-[#1A2A3A] text-white rounded-md hover:bg-[#2A3A4A] transition-colors"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
            <div className="bg-[#1A2A3A] rounded-lg p-8 text-white">
              <h3 className="text-2xl font-semibold mb-6 flex items-center">
                Tip Pro
                <span className="ml-2 text-[#00FFFF]">♪</span>
              </h3>
              <p className="mb-6">
                Mulailah dengan mempelajari chord dasar dari genre yang paling Anda sukai.
                Setelah mahir, Anda bisa mulai menjelajahi genre lain untuk memperluas kemampuan.
              </p>
              <div className="p-4 bg-[#2A3A4A] rounded-md">
                <h4 className="font-semibold text-[#00FFFF] mb-2">Rekomendasi Genre untuk Pemula:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-300">
                  <li>Pop - chord dasar dan progresi sederhana</li>
                  <li>Folk - strumming pattern yang berirama</li>
                  <li>Country - teknik fingerpicking dasar</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
