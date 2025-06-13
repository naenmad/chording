import Link from "next/link";

export default function FAQ() {
    const faqSections = [
        {
            id: "usage",
            title: "Cara Penggunaan",
            icon: "🎸",
            questions: [
                {
                    question: "Bagaimana cara mencari chord lagu?",
                    answer: "Gunakan kolom pencarian di halaman utama. Anda bisa mencari berdasarkan judul lagu, nama artis, atau genre musik. Sistem pencarian kami mendukung pencarian dengan kata kunci parsial.",
                },
                {
                    question: "Apakah chord di Chording akurat?",
                    answer: "Ya! Semua chord telah diverifikasi oleh musisi berpengalaman. Jika Anda menemukan chord yang tidak akurat, silakan laporkan melalui halaman kontak kami.",
                },
                {
                    question: "Bagaimana cara mengubah kunci chord?",
                    answer: "Di halaman chord, Anda dapat menggunakan fitur transpose untuk mengubah kunci sesuai dengan kemampuan vokal atau preferensi bermain Anda.",
                },
                {
                    question: "Apakah ada fitur autoscroll?",
                    answer: "Ya, kami menyediakan fitur autoscroll yang dapat disesuaikan kecepatannya untuk memudahkan Anda saat bermain musik.",
                },
            ],
        },
        {
            id: "account",
            title: "Akun & Profil",
            icon: "👤",
            questions: [
                {
                    question: "Apakah harus membuat akun untuk menggunakan Chording?",
                    answer: "Tidak! Chording dapat diakses secara gratis tanpa perlu membuat akun. Namun, dengan akun Anda bisa menyimpan chord favorit dan mendapatkan rekomendasi personal.",
                },
                {
                    question: "Bagaimana cara membuat akun?",
                    answer: "Klik tombol 'Daftar' di pojok kanan atas halaman. Anda bisa mendaftar dengan email atau akun Google/Facebook untuk kemudahan.",
                },
                {
                    question: "Apakah data pribadi saya aman?",
                    answer: "Tentu! Kami sangat serius dengan privasi pengguna. Baca kebijakan privasi kami untuk informasi lengkap tentang bagaimana kami melindungi data Anda.",
                },
            ],
        },
        {
            id: "music",
            title: "Chord & Musik",
            icon: "🎵",
            questions: [
                {
                    question: "Genre musik apa saja yang tersedia?",
                    answer: "Kami menyediakan chord untuk berbagai genre seperti Pop, Rock, Dangdut, Jazz, Folk, Alternative, dan masih banyak lagi. Total lebih dari 50 genre musik.",
                },
                {
                    question: "Apakah ada chord lagu internasional?",
                    answer: "Ya! Selain lagu Indonesia, kami juga menyediakan chord lagu internasional dari berbagai negara dan era.",
                },
                {
                    question: "Bagaimana cara request chord lagu?",
                    answer: "Anda bisa mengirim request melalui halaman kontak atau email. Kami akan berusaha menambahkan chord yang diminta dalam waktu 1-7 hari kerja.",
                },
                {
                    question: "Apakah ada chord untuk pemula?",
                    answer: "Tentu! Kami memiliki kategori khusus untuk chord pemula dengan tingkat kesulitan yang mudah dan panduan bermain yang lengkap.",
                },
            ],
        },
        {
            id: "technical",
            title: "Masalah Teknis",
            icon: "⚙️",
            questions: [
                {
                    question: "Website tidak bisa diakses, kenapa?",
                    answer: "Coba refresh halaman atau clear cache browser Anda. Jika masih bermasalah, hubungi tim support kami melalui WhatsApp untuk bantuan cepat.",
                },
                {
                    question: "Chord tidak tampil dengan benar di handphone",
                    answer: "Pastikan browser Anda sudah update ke versi terbaru. Website kami fully responsive dan optimal untuk semua perangkat.",
                },
                {
                    question: "Bagaimana cara melaporkan bug?",
                    answer: "Kirim laporan bug melalui email atau form kontak dengan detail masalah yang dialami, perangkat yang digunakan, dan screenshot jika memungkinkan.",
                },
            ],
        },
    ];

    const quickTips = [
        {
            title: "Gunakan Bookmark",
            description: "Simpan chord favorit dengan bookmark browser untuk akses cepat",
            icon: "🔖",
        },
        {
            title: "Pelajari Dasar-dasar",
            description: "Mulai dengan chord dasar seperti C, G, Am, F sebelum ke yang kompleks",
            icon: "📚",
        },
        {
            title: "Latihan Rutin",
            description: "Konsistensi latihan 15-30 menit sehari lebih baik daripada latihan marathon",
            icon: "⏰",
        },
        {
            title: "Gunakan Metronom",
            description: "Latihan dengan metronom membantu menjaga tempo dan timing yang tepat",
            icon: "🎼",
        },
    ];

    return (
        <div className="bg-[#E0E8EF] min-h-screen">
            {/* Hero Section */}
            <section className="bg-[#1A2A3A] text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Frequently Asked Questions
                        <span className="text-[#00FFFF]">.</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto">
                        Temukan jawaban atas pertanyaan yang sering diajukan tentang Chording dan cara penggunaannya.
                    </p>
                </div>
            </section>

            {/* Quick Search */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-6 text-[#1A2A3A]">
                        Cari Jawaban Cepat
                    </h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Ketik pertanyaan Anda..."
                            className="w-full py-3 px-5 pr-12 rounded-md border-2 border-[#1A2A3A] bg-white text-[#1A2A3A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF]"
                        />
                        <button className="absolute right-0 top-0 h-full px-5 rounded-r-md bg-[#00FFFF] text-[#1A2A3A] font-medium hover:bg-[#B0A0D0] transition-colors">
                            Cari
                        </button>
                    </div>
                </div>
            </section>

            {/* FAQ Sections */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    {faqSections.map((section) => (
                        <div key={section.id} id={section.id} className="mb-16">
                            <h2 className="text-3xl font-bold mb-8 text-[#1A2A3A] flex items-center">
                                <span className="mr-3 text-4xl">{section.icon}</span>
                                {section.title}
                                <span className="ml-2 text-[#00FFFF]">♪</span>
                            </h2>

                            <div className="space-y-6">
                                {section.questions.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg shadow-md border-t-4 border-[#00FFFF] overflow-hidden"
                                    >
                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold text-[#1A2A3A] mb-3">
                                                {item.question}
                                            </h3>
                                            <p className="text-gray-700 leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Tips */}
            <section className="py-16 px-4 bg-[#1A2A3A] text-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center">
                        Tips Bermain Gitar
                        <span className="ml-2 text-[#00FFFF]">♪</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickTips.map((tip, index) => (
                            <div
                                key={index}
                                className="bg-[#2A3A4A] p-6 rounded-lg text-center hover:bg-[#3A4A5A] transition-colors"
                            >
                                <div className="text-4xl mb-4">{tip.icon}</div>
                                <h3 className="text-xl font-semibold text-[#00FFFF] mb-3">{tip.title}</h3>
                                <p className="text-gray-300">{tip.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Still Need Help */}
            <section className="py-16 px-4 bg-[#B0A0D0] bg-opacity-20">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6 text-[#1A2A3A]">
                        Masih Butuh Bantuan
                        <span className="text-[#00FFFF]">?</span>
                    </h2>
                    <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
                        Jika Anda tidak menemukan jawaban yang dicari, jangan ragu untuk menghubungi tim support kami.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="inline-block px-8 py-4 bg-[#00FFFF] text-[#1A2A3A] rounded-md font-bold hover:bg-[#1A2A3A] hover:text-white transition-colors"
                        >
                            Hubungi Support
                        </Link>
                        <Link
                            href="mailto:hello@chording.com"
                            className="inline-block px-8 py-4 bg-transparent border-2 border-[#1A2A3A] text-[#1A2A3A] rounded-md font-bold hover:bg-[#1A2A3A] hover:text-white transition-colors"
                        >
                            Kirim Email
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
