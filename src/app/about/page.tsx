export default function About() {
    // Team data
    const teamMembers = [
        {
            id: 1,
            name: "Ahmad Zulkarnaen",
            role: "Founder & Lead Developer",
            description: "Passionate guitarist dan developer dengan pengalaman 4+ tahun di bidang musik dan teknologi.",
        },
        {
            id: 2,
            name: "Ahmad Zulkarnaen",
            role: "Music Content Curator",
            description: "Musisi amatir yang mengkurasi dan memverifikasi akurasi chord di platform ini.",
        },
        {
            id: 3,
            name: "Claude Sonnet IV",
            role: "UI/UX Designer",
            description: "Orang pintar dan ahli yang fokus menciptakan pengalaman pengguna yang intuitif.",
        },
    ];

    // Feature highlights
    const features = [
        {
            id: 1,
            title: "Database Chord Lengkap",
            description: "Ribuan chord lagu dari berbagai genre musik Indonesia dan internasional",
            icon: "🎵",
        },
        {
            id: 2,
            title: "Mudah Digunakan",
            description: "Interface yang user-friendly untuk pemula hingga musisi profesional",
            icon: "👆",
        },
        {
            id: 3,
            title: "Akurat & Terpercaya",
            description: "Semua chord telah diverifikasi oleh musisi berpengalaman",
            icon: "✅",
        },
        {
            id: 4,
            title: "Gratis Selamanya",
            description: "Akses penuh ke semua fitur tanpa biaya berlangganan",
            icon: "💝",
        },
    ];

    return (
        <div className="bg-[#E0E8EF] min-h-screen">
            {/* Hero Section */}
            <section className="bg-[#1A2A3A] text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Tentang Chording
                        <span className="text-[#00FFFF]">.</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-4xl mx-auto">
                        Platform chord gitar terpercaya yang didedikasikan untuk para pecinta musik Indonesia dan dunia.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-[#1A2A3A] flex items-center">
                                Misi Kami
                                <span className="ml-2 text-[#00FFFF]">♪</span>
                            </h2>
                            <p className="text-lg text-gray-700 mb-6">
                                Chording hadir untuk memudahkan para musisi, baik pemula maupun profesional, dalam belajar dan memainkan lagu-lagu favorit mereka. Kami percaya bahwa musik adalah bahasa universal yang menghubungkan hati dan jiwa.
                            </p>
                            <p className="text-lg text-gray-700 mb-6">
                                Dengan menyediakan chord yang akurat dan mudah diakses, kami berharap dapat menginspirasi lebih banyak orang untuk bermusik dan mengekspresikan kreativitas mereka.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-[#00FFFF]">
                            <h3 className="text-2xl font-semibold text-[#1A2A3A] mb-4">Visi Kami</h3>
                            <p className="text-gray-700 text-lg">
                                Menjadi platform chord gitar terdepan di Indonesia yang membantu setiap orang merasakan kebahagiaan bermusik, tanpa batas usia dan tingkat kemampuan.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 bg-[#1A2A3A] text-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center">
                        Mengapa Memilih Chording
                        <span className="ml-2 text-[#00FFFF]">?</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature) => (
                            <div
                                key={feature.id}
                                className="bg-[#2A3A4A] p-6 rounded-lg text-center hover:bg-[#3A4A5A] transition-colors"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-3 text-[#00FFFF]">{feature.title}</h3>
                                <p className="text-gray-300">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center text-[#1A2A3A] flex items-center justify-center">
                        Tim Chording
                        <span className="ml-2 text-[#00FFFF]">♪</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teamMembers.map((member) => (
                            <div
                                key={member.id}
                                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border-t-4 border-[#00FFFF]"
                            >
                                <div className="p-6 text-center">
                                    <div className="w-20 h-20 bg-[#1A2A3A] rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl text-[#00FFFF]">👤</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#1A2A3A] mb-2">{member.name}</h3>
                                    <p className="text-[#00FFFF] font-medium mb-3">{member.role}</p>
                                    <p className="text-gray-600">{member.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-16 px-4 bg-[#B0A0D0] bg-opacity-20">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center text-[#1A2A3A]">
                        Chording dalam Angka
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-[#00FFFF] mb-2">5000+</div>
                            <p className="text-[#1A2A3A] text-lg">Chord Lagu</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-[#00FFFF] mb-2">50+</div>
                            <p className="text-[#1A2A3A] text-lg">Genre Musik</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-[#00FFFF] mb-2">100K+</div>
                            <p className="text-[#1A2A3A] text-lg">Pengguna Aktif</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-[#00FFFF] mb-2">24/7</div>
                            <p className="text-[#1A2A3A] text-lg">Akses Gratis</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 px-4 bg-[#1A2A3A] text-white">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Ada Pertanyaan atau Saran
                        <span className="text-[#00FFFF]">?</span>
                    </h2>
                    <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
                        Kami selalu terbuka untuk feedback dan kolaborasi. Mari bermusik bersama!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:hello@chording.com"
                            className="inline-block px-6 py-3 bg-[#00FFFF] text-[#1A2A3A] rounded-md font-medium hover:bg-[#B0A0D0] transition-colors"
                        >
                            Kirim Email
                        </a>
                        <a
                            href="/contact"
                            className="inline-block px-6 py-3 bg-transparent border-2 border-[#00FFFF] text-[#00FFFF] rounded-md font-medium hover:bg-[#00FFFF] hover:text-[#1A2A3A] transition-colors"
                        >
                            Hubungi Kami
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}