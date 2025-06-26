import React from 'react';
import Link from 'next/link';
import { songAPI } from '@/lib/supabase';

// Types
type PopularSong = {
  id: string;
  slug?: string;
  title: string;
  artist_name: string;
  difficulty: string;
  genre_name: string;
  view_count: number;
};

export default async function PopularPage() {
  // Fetch popular songs from database
  const { data: popularChords = [], error } = await songAPI.getPopularSongs(20);

  // Sample time periods for filtering
  const timePeriods = [
    { id: "all-time", name: "Sepanjang Waktu" },
    { id: "this-week", name: "Minggu Ini" },
    { id: "this-month", name: "Bulan Ini" },
    { id: "this-year", name: "Tahun Ini" },
  ];

  return (
    <div className="bg-[#E0E8EF] min-h-screen">
      {/* Header Section */}
      <section className="bg-[#1A2A3A] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Chord Terpopuler
            <span className="text-[#00FFFF]">.</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Kumpulan chord gitar yang paling banyak dicari dan digunakan oleh musisi di seluruh Indonesia.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex space-x-2 mb-4 sm:mb-0">
              {timePeriods.map((period) => (
                <button
                  key={period.id}
                  className={`px-4 py-2 rounded-md ${period.id === "all-time"
                    ? "bg-[#1A2A3A] text-white"
                    : "bg-gray-100 text-[#1A2A3A] hover:bg-gray-200"
                    }`}
                >
                  {period.name}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Filter berdasarkan judul atau artis"
                className="w-full sm:w-64 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Chords List */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularChords && popularChords.length > 0 ? (
              popularChords.map((chord) => (
                <Link
                  href={`/chord/${chord.slug || chord.id}`}
                  key={chord.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="p-6 border-l-4 border-[#00FFFF]">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-[#1A2A3A] mb-1">{chord.title}</h3>
                        <p className="text-gray-600">{chord.artist_name}</p>
                      </div>
                      <span className="text-[#00FFFF] font-medium text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        {chord.view_count?.toLocaleString() || '0'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <span className="inline-block bg-[#E0E8EF] text-[#1A2A3A] text-sm px-3 py-1 rounded-full">
                          {chord.difficulty}
                        </span>
                        {chord.genre_name && (
                          <span className="inline-block bg-[#B0A0D0] bg-opacity-30 text-[#1A2A3A] text-sm px-3 py-1 rounded-full">
                            {chord.genre_name}
                          </span>
                        )}
                      </div>
                      <button className="text-sm text-[#1A2A3A] hover:text-[#00FFFF] transition-colors font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                        Bagikan
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="p-6 border-l-4 border-[#00FFFF]">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                Sebelumnya
              </button>
              <button className="px-3 py-2 rounded-md bg-[#1A2A3A] text-white">1</button>
              <button className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">2</button>
              <button className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">3</button>
              <span className="px-3 py-2 text-gray-500">...</span>
              <button className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">8</button>
              <button className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                Selanjutnya
              </button>
            </nav>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-[#B0A0D0] bg-opacity-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#1A2A3A]">
            Tidak menemukan chord yang Anda cari?
          </h2>
          <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
            Coba gunakan fitur pencarian untuk menemukan chord lagu favorit Anda dengan lebih cepat.
          </p>
          <div className="flex justify-center">
            <form className="w-full max-w-lg relative">
              <input
                type="text"
                placeholder="Cari judul lagu atau nama artis..."
                className="w-full py-3 px-5 pr-12 rounded-md border border-gray-300 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#00FFFF] text-[#1A2A3A] placeholder-gray-500"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-5 rounded-r-md bg-[#00FFFF] text-[#1A2A3A] font-medium hover:bg-[#B0A0D0] transition-colors"
              >
                Cari
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
