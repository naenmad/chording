import Link from "next/link";

export default function NotFound() {
    // Suggestion links
    const suggestions = [
        { id: 1, title: "Chord Terpopuler", href: "/popular", icon: "🔥" },
        { id: 2, title: "Jelajahi Genre", href: "/genre", icon: "🎵" },
        { id: 3, title: "Pencarian", href: "/search", icon: "🔍" },
        { id: 4, title: "Beranda", href: "/", icon: "🏠" },
    ];

    // Popular searches
    const popularSearches = [
        "Peterpan - Bintang di Surga",
        "Sheila on 7 - Dan",
        "Noah - Separuh Aku",
        "Iwan Fals - Kemesraan",
        "Dewa 19 - Kangen",
        "Ungu - Demi Waktu",
    ];

    return (
        <div className="bg-[#E0E8EF] min-h-screen">
            {/* Hero Section */}
            <section className="bg-[#1A2A3A] text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="mb-8">
                        <span className="text-8xl md:text-9xl font-bold text-[#00FFFF] block mb-4">404</span>
                        <h1 className="text-3xl md:text-5xl font-bold mb-6">
                            Halaman Tidak Ditemukan
                            <span className="text-[#00FFFF]">.</span>
                        </h1>
                    </div>
                    <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto">
                        Maaf, halaman yang Anda cari seperti chord yang hilang dalam lagu. Mari kita temukan chord yang tepat!
                    </p>
                </div>
            </section>

            {/* Search Section */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-[#1A2A3A] flex items-center justify-center">
                            Coba Cari Lagi
                            <span className="ml-2 text-[#00FFFF]">♪</span>
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Gunakan kolom pencarian di bawah untuk menemukan chord lagu yang Anda inginkan
                        </p>
                    </div>

                    <div className="flex justify-center mb-12">
                        <form className="w-full max-w-lg relative">
                            <input
                                type="text"
                                placeholder="Cari judul lagu atau nama artis..."
                                className="w-full py-3 px-5 pr-12 rounded-md border-2 border-[#1A2A3A] bg-white text-[#1A2A3A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF]"
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-0 h-full px-5 rounded-r-md bg-[#00FFFF] text-[#1A2A3A] font-medium hover:bg-[#B0A0D0] transition-colors"
                            >
                                Cari
                            </button>
                        </form>
                    </div>

                    {/* Popular Searches */}
                    <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-[#00FFFF] max-w-4xl mx-auto">
                        <h3 className="text-xl font-semibold text-[#1A2A3A] mb-4 text-center">
                            Pencarian Populer
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {popularSearches.map((search, index) => (
                                <Link
                                    key={index}
                                    href={`/search?q=${encodeURIComponent(search)}`}
                                    className="text-gray-600 hover:text-[#00FFFF] hover:underline transition-colors p-2 rounded hover:bg-[#E0E8EF]"
                                >
                                    {search}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Navigation */}
            <section className="py-16 px-4 bg-[#1A2A3A] text-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center">
                        Atau Kunjungi Halaman Lain
                        <span className="ml-2 text-[#00FFFF]">♪</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {suggestions.map((suggestion) => (
                            <Link
                                href={suggestion.href}
                                key={suggestion.id}
                                className="bg-[#2A3A4A] p-6 rounded-lg text-center hover:bg-[#3A4A5A] transition-colors group"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                                    {suggestion.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-[#00FFFF] mb-2">{suggestion.title}</h3>
                                <p className="text-gray-300 text-sm">Klik untuk mengunjungi</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Help Section */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-[#1A2A3A] flex items-center">
                                Butuh Bantuan
                                <span className="ml-2 text-[#00FFFF]">?</span>
                            </h2>
                            <p className="text-lg text-gray-700 mb-6">
                                Jika Anda tidak dapat menemukan chord yang dicari atau mengalami masalah teknis, jangan ragu untuk menghubungi tim support kami.
                            </p>
                            <p className="text-lg text-gray-700 mb-6">
                                Kami siap membantu Anda menemukan chord lagu favorit atau menyelesaikan kendala yang Anda hadapi.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/contact"
                                    className="inline-block px-6 py-3 bg-[#00FFFF] text-[#1A2A3A] rounded-md font-medium hover:bg-[#B0A0D0] transition-colors text-center"
                                >
                                    Hubungi Support
                                </Link>
                                <Link
                                    href="/faq"
                                    className="inline-block px-6 py-3 bg-transparent border-2 border-[#1A2A3A] text-[#1A2A3A] rounded-md font-medium hover:bg-[#1A2A3A] hover:text-white transition-colors text-center"
                                >
                                    Lihat FAQ
                                </Link>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-[#00FFFF]">
                            <h3 className="text-2xl font-semibold text-[#1A2A3A] mb-4">Tips Pencarian</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-[#00FFFF] mr-2">•</span>
                                    Coba gunakan kata kunci yang lebih spesifik
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#00FFFF] mr-2">•</span>
                                    Periksa ejaan judul lagu atau nama artis
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#00FFFF] mr-2">•</span>
                                    Gunakan pencarian berdasarkan genre
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#00FFFF] mr-2">•</span>
                                    Coba cari dengan nama artis saja
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Back to Home */}
            <section className="py-16 px-4 bg-[#B0A0D0] bg-opacity-20">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6 text-[#1A2A3A]">
                        Kembali ke Beranda
                    </h2>
                    <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
                        Mulai lagi dari halaman utama dan temukan ribuan chord lagu favorit Anda.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-8 py-4 bg-[#00FFFF] text-[#1A2A3A] rounded-md font-bold hover:bg-[#1A2A3A] hover:text-white transition-colors"
                    >
                        ← Kembali ke Beranda
                    </Link>
                </div>
            </section>
        </div>
    );
}