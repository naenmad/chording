import Link from "next/link";
import OnboardingBanner from "@/components/OnboardingBanner";
import { songAPI } from "@/lib/supabase";
import { ChordSkeleton } from "@/components/ui/skeleton";
// import HomeFloatingActions from "@/components/ui/home-floating-actions";

// Server Component - fetch data on server
export default async function Home() {
  // Fetch featured songs from database
  const { data: featuredChords = [] } = await songAPI.getFeaturedSongs(4);

  // Fetch genres with count from database
  const genresResponse = await songAPI.getGenresWithCount();
  const genres = genresResponse?.data || [];

  // Fetch website statistics
  const statsResponse = await songAPI.getWebsiteStats();
  const stats = statsResponse?.data || {
    totalSongs: 0,
    totalGenres: 0,
    totalArtists: 0,
    totalUsers: 0
  };

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
            <form
              action="/search"
              method="GET"
              className="w-full max-w-lg relative"
            >
              <input
                type="text"
                name="q"
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

      {/* Onboarding Banner */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <OnboardingBanner />
      </div>

      {/* Website Statistics Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-[#1A2A3A] flex items-center">
            Statistik Platform
            <span className="ml-2 text-[#00FFFF]">📊</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Total Songs */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1 border-t-4 border-[#00FFFF]">
              <div className="p-6 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#1A2A3A] mb-2 flex items-center justify-center">
                  <span className="mr-2 text-[#00FFFF]">🎵</span>
                  {stats.totalSongs.toLocaleString()}
                </div>
                <div className="text-base sm:text-lg font-semibold text-[#1A2A3A] mb-1">
                  Lagu
                </div>
                <div className="text-sm text-gray-600">
                  Chord tersedia
                </div>
              </div>
            </div>

            {/* Total Artists */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1 border-t-4 border-[#B0A0D0]">
              <div className="p-6 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#1A2A3A] mb-2 flex items-center justify-center">
                  <span className="mr-2 text-[#B0A0D0]">🎤</span>
                  {stats.totalArtists.toLocaleString()}
                </div>
                <div className="text-base sm:text-lg font-semibold text-[#1A2A3A] mb-1">
                  Artis
                </div>
                <div className="text-sm text-gray-600">
                  Musisi terdaftar
                </div>
              </div>
            </div>

            {/* Total Genres */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1 border-t-4 border-[#1A2A3A]">
              <div className="p-6 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#1A2A3A] mb-2 flex items-center justify-center">
                  <span className="mr-2 text-[#1A2A3A]">🎼</span>
                  {stats.totalGenres.toLocaleString()}
                </div>
                <div className="text-base sm:text-lg font-semibold text-[#1A2A3A] mb-1">
                  Genre
                </div>
                <div className="text-sm text-gray-600">
                  Kategori musik
                </div>
              </div>
            </div>

            {/* Total Users */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1 border-t-4 border-[#00FFFF]">
              <div className="p-6 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#1A2A3A] mb-2 flex items-center justify-center">
                  <span className="mr-2 text-[#00FFFF]">👥</span>
                  {stats.totalUsers.toLocaleString()}+
                </div>
                <div className="text-base sm:text-lg font-semibold text-[#1A2A3A] mb-1">
                  Pengguna
                </div>
                <div className="text-sm text-gray-600">
                  Komunitas aktif
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Bergabunglah dengan ribuan musisi Indonesia yang telah menggunakan platform ini
              untuk belajar dan berbagi chord lagu favorit mereka. Platform kami terus berkembang
              dengan dukungan komunitas yang aktif.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <div className="flex items-center text-sm text-gray-500">
                <span className="w-2 h-2 bg-[#00FFFF] rounded-full mr-2"></span>
                Diperbarui setiap hari
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="w-2 h-2 bg-[#B0A0D0] rounded-full mr-2"></span>
                Komunitas aktif
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="w-2 h-2 bg-[#1A2A3A] rounded-full mr-2"></span>
                Gratis selamanya
              </div>
            </div>
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
            {featuredChords && featuredChords.length > 0 ? (
              featuredChords.map((chord) => (
                <Link
                  href={`/chord/${chord.slug || chord.id}`}
                  key={chord.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="p-6 border-t-4 border-[#00FFFF]">
                    <h3 className="text-xl font-semibold text-[#1A2A3A] mb-2">{chord.title}</h3>
                    <p className="text-gray-600 mb-3">{chord.artist_name}</p>
                    <div className="flex justify-between items-center">
                      <span className="inline-block bg-[#E0E8EF] text-[#1A2A3A] text-sm px-3 py-1 rounded-full">
                        {chord.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">
                        {chord.view_count?.toLocaleString()} views
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Loading skeleton when no data
              Array.from({ length: 4 }).map((_, index) => (
                <ChordSkeleton key={index} />
              ))
            )}
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
            {genres && genres.length > 0 ? (
              genres.slice(0, 6).map((genre: { id: string; name: string; count: unknown }) => (
                <Link
                  href={`/genre/songs?name=${encodeURIComponent(genre.name)}`}
                  key={genre.id}
                  className="bg-[#2A3A4A] p-6 rounded-lg text-center hover:bg-[#3A4A5A] transition-colors"
                >
                  <h3 className="text-xl font-semibold mb-2">{genre.name}</h3>
                  <p className="text-[#00FFFF]">{Number(genre.count)} lagu</p>
                </Link>
              ))
            ) : (
              // Fallback genres
              ['Pop', 'Rock', 'Folk', 'Jazz', 'Alternative', 'Dangdut'].map((genreName, index) => (
                <Link
                  href={`/genre/songs?name=${encodeURIComponent(genreName)}`}
                  key={index}
                  className="bg-[#2A3A4A] p-6 rounded-lg text-center hover:bg-[#3A4A5A] transition-colors"
                >
                  <h3 className="text-xl font-semibold mb-2">{genreName}</h3>
                  <p className="text-[#00FFFF]">-- lagu</p>
                </Link>
              ))
            )}
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

      {/* Call to Action dengan tambahan untuk user yang login */}
      <section className="py-16 px-4 bg-[#B0A0D0] bg-opacity-20 relative">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#1A2A3A]">
            Mulai Bermain Sekarang
          </h2>
          <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
            Dapatkan akses ke ribuan chord lagu dari berbagai genre dan artis favoritmu.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/popular"
              className="inline-block px-8 py-4 bg-[#00FFFF] text-[#1A2A3A] rounded-md font-bold hover:bg-[#1A2A3A] hover:text-white transition-colors"
            >
              Jelajahi Chord
            </Link>
            <Link
              href="/add-chord"
              className="inline-block px-8 py-4 bg-[#1A2A3A] text-white rounded-md font-bold hover:bg-[#00FFFF] hover:text-[#1A2A3A] transition-colors border-2 border-[#1A2A3A] hover:border-[#00FFFF]"
            >
              Tambah Chord
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
