import Link from "next/link";

export default function Contact() {
    const contactMethods = [
        {
            id: 1,
            title: "Email",
            description: "Kirim pertanyaan atau saran langsung ke email kami",
            value: "hello@chording.com",
            icon: "📧",
            action: "mailto:hello@chording.com",
        },
        {
            id: 2,
            title: "WhatsApp",
            description: "Hubungi kami melalui WhatsApp untuk respon cepat",
            value: "+62 812-3456-7890",
            icon: "📱",
            action: "https://wa.me/6281234567890",
        },
        {
            id: 3,
            title: "Instagram",
            description: "Follow dan DM kami di Instagram",
            value: "@chording_official",
            icon: "📸",
            action: "https://instagram.com/chording_official",
        },
        {
            id: 4,
            title: "Facebook",
            description: "Bergabung dengan komunitas di Facebook",
            value: "Chording Indonesia",
            icon: "📘",
            action: "https://facebook.com/chording.indonesia",
        },
    ];

    const faqCategories = [
        { title: "Cara Penggunaan", count: 8, href: "/faq#usage" },
        { title: "Akun & Profil", count: 5, href: "/faq#account" },
        { title: "Chord & Musik", count: 12, href: "/faq#music" },
        { title: "Teknis", count: 6, href: "/faq#technical" },
    ];

    return (
        <div className="bg-[#E0E8EF] min-h-screen">
            {/* Hero Section */}
            <section className="bg-[#1A2A3A] text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Hubungi Kami
                        <span className="text-[#00FFFF]">.</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto">
                        Kami siap membantu Anda dengan pertanyaan, saran, atau masalah teknis yang dihadapi.
                    </p>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center text-[#1A2A3A] flex items-center justify-center">
                        Cara Menghubungi Kami
                        <span className="ml-2 text-[#00FFFF]">♪</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactMethods.map((method) => (
                            <a
                                href={method.action}
                                key={method.id}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border-t-4 border-[#00FFFF] group"
                            >
                                <div className="p-6 text-center">
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                                        {method.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#1A2A3A] mb-2">{method.title}</h3>
                                    <p className="text-gray-600 mb-3 text-sm">{method.description}</p>
                                    <p className="text-[#00FFFF] font-medium">{method.value}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-16 px-4 bg-[#1A2A3A] text-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center">
                        Kirim Pesan
                        <span className="ml-2 text-[#00FFFF]">♪</span>
                    </h2>

                    <div className="bg-[#2A3A4A] p-8 rounded-lg">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        className="w-full px-4 py-3 rounded-md bg-[#1A2A3A] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF]"
                                        placeholder="Masukkan nama lengkap Anda"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        className="w-full px-4 py-3 rounded-md bg-[#1A2A3A] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF]"
                                        placeholder="nama@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                                    Subjek
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    required
                                    className="w-full px-4 py-3 rounded-md bg-[#1A2A3A] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF]"
                                >
                                    <option value="">Pilih kategori pesan</option>
                                    <option value="request">Request Chord Lagu</option>
                                    <option value="bug">Laporan Bug/Error</option>
                                    <option value="suggestion">Saran & Kritik</option>
                                    <option value="partnership">Kerjasama & Partnership</option>
                                    <option value="other">Lainnya</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">
                                    Pesan
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={6}
                                    required
                                    className="w-full px-4 py-3 rounded-md bg-[#1A2A3A] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF] resize-vertical"
                                    placeholder="Tulis pesan Anda di sini..."
                                ></textarea>
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-[#00FFFF] text-[#1A2A3A] rounded-md font-bold hover:bg-[#B0A0D0] transition-colors"
                                >
                                    Kirim Pesan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* FAQ Quick Links */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center text-[#1A2A3A] flex items-center justify-center">
                        Pertanyaan Umum
                        <span className="ml-2 text-[#00FFFF]">?</span>
                    </h2>
                    <p className="text-center text-gray-600 mb-12">
                        Sebelum menghubungi kami, coba cek FAQ untuk jawaban cepat
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {faqCategories.map((category, index) => (
                            <Link
                                href={category.href}
                                key={index}
                                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-[#00FFFF] text-center"
                            >
                                <h3 className="text-lg font-semibold text-[#1A2A3A] mb-2">{category.title}</h3>
                                <p className="text-[#00FFFF] font-medium">{category.count} pertanyaan</p>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <Link
                            href="/faq"
                            className="inline-block px-6 py-3 bg-[#1A2A3A] text-white rounded-md hover:bg-[#2A3A4A] transition-colors"
                        >
                            Lihat Semua FAQ
                        </Link>
                    </div>
                </div>
            </section>

            {/* Response Time */}
            <section className="py-16 px-4 bg-[#B0A0D0] bg-opacity-20">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6 text-[#1A2A3A]">
                        Waktu Respon Kami
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                        <div>
                            <div className="text-3xl font-bold text-[#00FFFF] mb-2">&lt; 2 Jam</div>
                            <p className="text-[#1A2A3A]">WhatsApp & Instagram</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#00FFFF] mb-2">&lt; 24 Jam</div>
                            <p className="text-[#1A2A3A]">Email & Form Kontak</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#00FFFF] mb-2">24/7</div>
                            <p className="text-[#1A2A3A]">Support Online</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}