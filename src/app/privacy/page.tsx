import Link from "next/link";

export default function Privacy() {
    const lastUpdated = "13 Juni 2025";

    const privacySections = [
        {
            id: "introduction",
            title: "Pendahuluan",
            content: [
                "Selamat datang di Chording. Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi yang Anda berikan kepada kami.",
                "Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi Anda saat menggunakan layanan Chording.",
                "Dengan menggunakan layanan kami, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan ini.",
            ],
        },
        {
            id: "data-collection",
            title: "Informasi yang Kami Kumpulkan",
            content: [
                "Informasi Pribadi: Nama, alamat email, dan informasi kontak lainnya yang Anda berikan saat mendaftar atau menghubungi kami.",
                "Data Penggunaan: Informasi tentang bagaimana Anda menggunakan layanan kami, termasuk halaman yang dikunjungi, waktu akses, dan perangkat yang digunakan.",
                "Cookie dan Teknologi Serupa: Kami menggunakan cookie untuk meningkatkan pengalaman pengguna dan menganalisis penggunaan situs.",
                "Informasi Preferensi: Chord favorit, riwayat pencarian, dan pengaturan personalisasi lainnya.",
            ],
        },
        {
            id: "data-usage",
            title: "Bagaimana Kami Menggunakan Informasi Anda",
            content: [
                "Menyediakan dan memelihara layanan chord guitar yang berkualitas.",
                "Memberikan rekomendasi chord yang sesuai dengan preferensi Anda.",
                "Mengirim pemberitahuan tentang pembaruan layanan dan chord baru.",
                "Merespons pertanyaan, komentar, dan permintaan bantuan Anda.",
                "Menganalisis penggunaan untuk meningkatkan kualitas layanan.",
                "Melindungi keamanan dan integritas platform kami.",
            ],
        },
        {
            id: "data-sharing",
            title: "Pembagian Informasi",
            content: [
                "Kami TIDAK menjual, menyewakan, atau mempertukarkan informasi pribadi Anda kepada pihak ketiga untuk tujuan komersial.",
                "Kami dapat membagikan informasi dalam situasi berikut:",
                "• Dengan persetujuan eksplisit dari Anda",
                "• Untuk mematuhi kewajiban hukum atau perintah pengadilan",
                "• Untuk melindungi hak, properti, atau keselamatan Chording dan pengguna lainnya",
                "• Dengan penyedia layanan yang membantu operasional kami (dengan perjanjian kerahasiaan yang ketat)",
            ],
        },
        {
            id: "data-security",
            title: "Keamanan Data",
            content: [
                "Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang tepat untuk melindungi informasi Anda.",
                "Data disimpan di server yang aman dengan enkripsi dan perlindungan berlapis.",
                "Akses ke informasi pribadi dibatasi hanya untuk karyawan yang memerlukan akses tersebut.",
                "Namun, perlu diingat bahwa tidak ada sistem yang 100% aman. Kami terus memperbarui dan meningkatkan langkah-langkah keamanan kami.",
            ],
        },
        {
            id: "cookies",
            title: "Cookie dan Teknologi Pelacakan",
            content: [
                "Cookie Esensial: Diperlukan untuk fungsi dasar situs web, seperti menyimpan preferensi pengguna.",
                "Cookie Analitik: Membantu kami memahami bagaimana pengguna berinteraksi dengan situs untuk meningkatkan layanan.",
                "Cookie Fungsional: Menyimpan preferensi Anda seperti pengaturan kunci chord dan tema tampilan.",
                "Anda dapat mengatur browser untuk menolak cookie, namun beberapa fitur mungkin tidak berfungsi optimal.",
            ],
        },
        {
            id: "user-rights",
            title: "Hak-hak Anda",
            content: [
                "Akses: Anda berhak untuk mengetahui informasi pribadi apa yang kami simpan tentang Anda.",
                "Koreksi: Anda dapat meminta kami untuk memperbaiki informasi yang tidak akurat.",
                "Penghapusan: Anda dapat meminta penghapusan data pribadi Anda dari sistem kami.",
                "Portabilitas: Anda dapat meminta salinan data Anda dalam format yang dapat dibaca mesin.",
                "Keberatan: Anda dapat menolak penggunaan data Anda untuk tujuan pemasaran atau analisis.",
                "Untuk menggunakan hak-hak ini, silakan hubungi kami melalui email atau halaman kontak.",
            ],
        },
        {
            id: "data-retention",
            title: "Penyimpanan Data",
            content: [
                "Kami menyimpan informasi pribadi Anda selama akun Anda aktif atau sesuai kebutuhan untuk menyediakan layanan.",
                "Data akan dihapus secara otomatis setelah periode tertentu jika akun tidak aktif.",
                "Beberapa informasi mungkin disimpan lebih lama untuk keperluan hukum atau keamanan.",
                "Anda dapat meminta penghapusan data kapan saja melalui pengaturan akun atau dengan menghubungi kami.",
            ],
        },
        {
            id: "minors",
            title: "Perlindungan Anak",
            content: [
                "Layanan kami dapat digunakan oleh pengguna di bawah 18 tahun dengan pengawasan orang tua.",
                "Kami tidak secara sengaja mengumpulkan informasi pribadi dari anak di bawah 13 tahun.",
                "Jika kami mengetahui bahwa anak di bawah 13 tahun telah memberikan informasi pribadi, kami akan menghapusnya.",
                "Orang tua dapat menghubungi kami untuk meninjau, menghapus, atau melarang pengumpulan informasi anak mereka.",
            ],
        },
        {
            id: "changes",
            title: "Perubahan Kebijakan",
            content: [
                "Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu untuk mencerminkan perubahan dalam praktik atau hukum.",
                "Perubahan signifikan akan diberitahukan melalui email atau pemberitahuan di situs web.",
                "Versi terbaru akan selalu tersedia di halaman ini dengan tanggal pembaruan yang jelas.",
                "Dengan terus menggunakan layanan setelah perubahan, Anda menyetujui kebijakan yang diperbarui.",
            ],
        },
    ];

    return (
        <div className="bg-[#E0E8EF] min-h-screen">
            {/* Hero Section */}
            <section className="bg-[#1A2A3A] text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Kebijakan Privasi
                        <span className="text-[#00FFFF]">.</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-6 text-gray-300 max-w-3xl mx-auto">
                        Kami menghargai dan melindungi privasi Anda dengan serius.
                    </p>
                    <p className="text-lg text-gray-400">
                        Terakhir diperbarui: {lastUpdated}
                    </p>
                </div>
            </section>

            {/* Table of Contents */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-[#00FFFF]">
                        <h2 className="text-2xl font-bold mb-6 text-[#1A2A3A]">Daftar Isi</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {privacySections.map((section, index) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="text-[#00FFFF] hover:text-[#1A2A3A] hover:underline transition-colors p-2 rounded hover:bg-[#E0E8EF]"
                                >
                                    {index + 1}. {section.title}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Privacy Policy Content */}
            <section className="py-8 px-4">
                <div className="max-w-4xl mx-auto space-y-12">
                    {privacySections.map((section, index) => (
                        <div key={section.id} id={section.id} className="bg-white p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-6 text-[#1A2A3A] flex items-center">
                                <span className="bg-[#00FFFF] text-[#1A2A3A] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                                    {index + 1}
                                </span>
                                {section.title}
                            </h2>
                            <div className="space-y-4">
                                {section.content.map((paragraph, pIndex) => (
                                    <p key={pIndex} className="text-gray-700 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Information */}
            <section className="py-16 px-4 bg-[#1A2A3A] text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Hubungi Kami tentang Privasi
                        <span className="text-[#00FFFF]">.</span>
                    </h2>
                    <p className="text-xl mb-8 text-gray-300">
                        Jika Anda memiliki pertanyaan atau kekhawatiran tentang kebijakan privasi ini, jangan ragu untuk menghubungi kami.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#2A3A4A] p-6 rounded-lg">
                            <div className="text-3xl mb-3">📧</div>
                            <h3 className="font-semibold mb-2">Email</h3>
                            <p className="text-[#00FFFF]">privacy@chording.com</p>
                        </div>
                        <div className="bg-[#2A3A4A] p-6 rounded-lg">
                            <div className="text-3xl mb-3">📱</div>
                            <h3 className="font-semibold mb-2">WhatsApp</h3>
                            <p className="text-[#00FFFF]">+62 812-3456-7890</p>
                        </div>
                        <div className="bg-[#2A3A4A] p-6 rounded-lg">
                            <div className="text-3xl mb-3">💬</div>
                            <h3 className="font-semibold mb-2">Form Kontak</h3>
                            <Link href="/contact" className="text-[#00FFFF] hover:underline">
                                Hubungi Kami
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Summary */}
            <section className="py-16 px-4 bg-[#B0A0D0] bg-opacity-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6 text-[#1A2A3A]">
                        Ringkasan Kebijakan Privasi
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#00FFFF]">
                            <div className="text-3xl mb-3">🔒</div>
                            <h3 className="font-semibold text-[#1A2A3A] mb-2">Data Aman</h3>
                            <p className="text-gray-700 text-sm">Informasi Anda dilindungi dengan enkripsi dan keamanan berlapis</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#00FFFF]">
                            <div className="text-3xl mb-3">🚫</div>
                            <h3 className="font-semibold text-[#1A2A3A] mb-2">Tidak Dijual</h3>
                            <p className="text-gray-700 text-sm">Kami tidak pernah menjual data pribadi Anda kepada pihak ketiga</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#00FFFF]">
                            <div className="text-3xl mb-3">⚖️</div>
                            <h3 className="font-semibold text-[#1A2A3A] mb-2">Hak Anda</h3>
                            <p className="text-gray-700 text-sm">Anda memiliki kontrol penuh atas data pribadi Anda</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
