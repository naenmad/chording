import Image from "next/image";
import Link from "next/link";

export default function Home() {
  // Sample featured chord data
  const featuredChords = [
    { id: 1, title: "Bintang di Surga", artist: "Peterpan", difficulty: "Intermediate" },
    { id: 2, title: "Kau Adalah", artist: "Isyana Sarasvati", difficulty: "Easy" },
    { id: 3, title: "Aku Milikmu", artist: "Iwan Fals", difficulty: "Advanced" },
    { id: 4, title: "Mencari Alasan", artist: "Exists", difficulty: "Intermediate" },
  ];

  // Sample genre data
  const genres = [
    { id: 1, name: "Pop", count: 120 },
    { id: 2, name: "Rock", count: 85 },
    { id: 3, name: "Dangdut", count: 64 },
    { id: 4, name: "Jazz", count: 42 },
    { id: 5, name: "Folk", count: 37 },
    { id: 6, name: "Alternative", count: 29 },
  ];

  return (
    <div className="bg-[#E0E8EF] min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#1A2A3A] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Temukan Chord Lagu Favoritmu
            <span className="text-[#00FFFF]">.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto">
            Kumpulan chord gitar terlengkap untuk berbagai genre musik Indonesia dan Internasional.
          </p>
          <div className="flex justify-center">
            <form className="w-full max-w-lg relative">
              <input
                type="text"
                placeholder="Cari judul lagu atau nama artis..."
                className="w-full py-3 px-5 pr-12 rounded-md border-0 bg-[#2A3A4A] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
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

      {/* Featured Chords Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-[#1A2A3A] flex items-center">
            Chord Terpopuler
            <span className="ml-2 text-[#00FFFF]">♪</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredChords.map((chord) => (
              <Link
                href={`/chord/${chord.id}`}
                key={chord.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="p-6 border-t-4 border-[#00FFFF]">
                  <h3 className="text-xl font-semibold text-[#1A2A3A] mb-2">{chord.title}</h3>
                  <p className="text-gray-600 mb-3">{chord.artist}</p>
                  <span className="inline-block bg-[#E0E8EF] text-[#1A2A3A] text-sm px-3 py-1 rounded-full">
                    {chord.difficulty}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/popular"
              className="inline-block px-6 py-3 bg-[#1A2A3A] text-white rounded-md hover:bg-[#2A3A4A] transition-colors"
            >
              Lihat Lebih Banyak
            </Link>
          </div>
        </div>
      </section>

      {/* Genres Section */}
      <section className="py-16 px-4 bg-[#1A2A3A] text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            Jelajahi Genre
            <span className="ml-2 text-[#00FFFF]">♪</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {genres.map((genre) => (
              <Link
                href={`/genre/${genre.id}`}
                key={genre.id}
                className="bg-[#2A3A4A] p-6 rounded-lg text-center hover:bg-[#3A4A5A] transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2">{genre.name}</h3>
                <p className="text-[#00FFFF]">{genre.count} lagu</p>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/genre"
              className="inline-block px-6 py-3 bg-[#00FFFF] text-[#1A2A3A] rounded-md hover:bg-[#B0A0D0] transition-colors font-medium"
            >
              Lihat Semua Genre
            </Link>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#1A2A3A] flex items-center justify-center">
            Cara Menggunakan Chord
            <span className="ml-2 text-[#00FFFF]">.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-[#1A2A3A] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-[#00FFFF]">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#1A2A3A]">Cari Lagu</h3>
              <p className="text-gray-600">
                Gunakan kolom pencarian untuk menemukan chord lagu favorit Anda berdasarkan judul atau artis.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-[#1A2A3A] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-[#00FFFF]">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#1A2A3A]">Lihat Chord</h3>
              <p className="text-gray-600">
                Baca dan pelajari chord lagu yang dapat disesuaikan dengan kunci yang Anda inginkan.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-[#1A2A3A] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-[#00FFFF]">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#1A2A3A]">Mainkan Musik</h3>
              <p className="text-gray-600">
                Praktekkan chord dengan alat musik Anda dan nikmati bermain lagu favorit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-[#B0A0D0] bg-opacity-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#1A2A3A]">
            Mulai Bermain Sekarang
          </h2>
          <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
            Dapatkan akses ke ribuan chord lagu dari berbagai genre dan artis favoritmu.
          </p>
          <Link
            href="/popular"
            className="inline-block px-8 py-4 bg-[#00FFFF] text-[#1A2A3A] rounded-md font-bold hover:bg-[#1A2A3A] hover:text-white transition-colors"
          >
            Jelajahi Chord
          </Link>
        </div>
      </section>
    </div>
  );
}
