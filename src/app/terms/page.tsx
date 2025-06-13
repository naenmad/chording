import Link from "next/link";

export default function Terms() {
    const lastUpdated = "13 Juni 2025";

    const termsSections = [
        {
            id: "acceptance",
            title: "Penerimaan Syarat",
            content: [
                "Selamat datang di Chording. Dengan mengakses dan menggunakan layanan kami, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini.",
                "Jika Anda tidak menyetujui salah satu bagian dari syarat ini, Anda tidak diperbolehkan menggunakan layanan kami.",
                "Kami berhak untuk mengubah syarat ini kapan saja. Perubahan akan berlaku segera setelah dipublikasikan di halaman ini.",
                "Penggunaan berkelanjutan atas layanan kami setelah perubahan berarti Anda menerima syarat yang telah diperbarui.",
            ],
        },
        {
            id: "service-description",
            title: "Deskripsi Layanan",
            content: [
                "Chording adalah platform online yang menyediakan chord gitar untuk berbagai lagu Indonesia dan internasional.",
                "Kami menyediakan layanan pencarian chord, koleksi chord berdasarkan genre, dan fitur-fitur pendukung lainnya.",
                "Layanan disediakan 'sebagaimana adanya' dan kami berusaha menjaga keakuratan informasi yang disediakan.",
                "Kami berhak untuk memodifikasi, menghentikan, atau membatasi akses ke layanan kapan saja tanpa pemberitahuan sebelumnya.",
            ],
        },
        {
            id: "user-accounts",
            title: "Akun Pengguna",
            content: [
                "Untuk mengakses fitur tertentu, Anda mungkin perlu membuat akun dengan memberikan informasi yang akurat dan lengkap.",
                "Anda bertanggung jawab untuk menjaga keamanan akun dan kata sandi Anda.",
                "Anda setuju untuk tidak membagikan akun Anda dengan orang lain atau menggunakan akun orang lain tanpa izin.",
                "Kami berhak untuk menutup, menangguhkan, atau membatasi akun yang melanggar syarat ini.",
                "Anda harus segera memberitahu kami jika ada penggunaan akun yang tidak sah.",
            ],
        },
        {
            id: "acceptable-use",
            title: "Penggunaan yang Diperbolehkan",
            content: [
                "Anda setuju untuk menggunakan layanan hanya untuk tujuan yang sah dan sesuai dengan syarat ini.",
                "Anda TIDAK BOLEH:",
                "• Menggunakan layanan untuk tujuan ilegal atau melanggar hukum yang berlaku",
                "• Mengirim atau mengunggah konten yang mengandung virus, malware, atau kode berbahaya",
                "• Melakukan scraping, crawling, atau mengunduh konten secara otomatis dalam jumlah besar",
                "• Menggunakan layanan untuk spam, phishing, atau aktivitas penipuan lainnya",
                "• Mengganggu atau merusak infrastruktur layanan kami",
                "• Melanggar hak kekayaan intelektual pihak lain",
            ],
        },
        {
            id: "content-rights",
            title: "Hak Konten dan Kekayaan Intelektual",
            content: [
                "Semua chord, lirik, dan konten musik di platform ini dilindungi oleh hak cipta masing-masing pemiliknya.",
                "Kami menyediakan chord untuk tujuan edukasi dan pembelajaran musik pribadi.",
                "Pengguna tidak diperbolehkan menggunakan konten untuk tujuan komersial tanpa izin dari pemegang hak cipta.",
                "Kami menghormati hak kekayaan intelektual dan akan menanggapi klaim pelanggaran hak cipta sesuai dengan prosedur yang berlaku.",
                "Jika Anda yakin konten kami melanggar hak cipta Anda, silakan hubungi kami dengan detail yang lengkap.",
            ],
        },
        {
            id: "user-content",
            title: "Konten Pengguna",
            content: [
                "Pengguna dapat mengirimkan komentar, saran, atau konten lainnya melalui fitur yang tersedia.",
                "Dengan mengirimkan konten, Anda memberikan kami lisensi non-eksklusif untuk menggunakan, memodifikasi, dan menampilkan konten tersebut.",
                "Anda bertanggung jawab atas konten yang Anda kirimkan dan memastikan tidak melanggar hak pihak lain.",
                "Kami berhak untuk menghapus konten yang dianggap tidak pantas, melanggar hukum, atau melanggar syarat ini.",
                "Kami tidak berkewajiban untuk memantau atau menyunting konten pengguna, tetapi berhak untuk melakukannya.",
            ],
        },
        {
            id: "privacy",
            title: "Privasi",
            content: [
                "Penggunaan informasi pribadi Anda diatur oleh Kebijakan Privasi kami yang merupakan bagian integral dari syarat ini.",
                "Dengan menggunakan layanan, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan Kebijakan Privasi.",
                "Kami berkomitmen untuk melindungi privasi Anda dan tidak akan menjual informasi pribadi kepada pihak ketiga.",
                "Untuk informasi lengkap tentang bagaimana kami menangani data Anda, silakan baca Kebijakan Privasi kami.",
            ],
        },
        {
            id: "disclaimers",
            title: "Penyangkalan",
            content: [
                "Layanan disediakan 'sebagaimana adanya' tanpa jaminan apapun, baik tersurat maupun tersirat.",
                "Kami tidak menjamin bahwa layanan akan selalu tersedia, bebas error, atau memenuhi kebutuhan spesifik Anda.",
                "Kami tidak bertanggung jawab atas keakuratan, kelengkapan, atau keandalan konten chord yang disediakan.",
                "Penggunaan layanan adalah risiko Anda sendiri, dan Anda bertanggung jawab untuk memverifikasi keakuratan informasi.",
                "Kami tidak menjamin bahwa layanan akan kompatibel dengan semua perangkat atau sistem operasi.",
            ],
        },
        {
            id: "limitation-liability",
            title: "Pembatasan Tanggung Jawab",
            content: [
                "Dalam batas maksimal yang diizinkan hukum, kami tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial.",
                "Total tanggung jawab kami kepada Anda tidak akan melebihi jumlah yang Anda bayarkan kepada kami dalam 12 bulan terakhir.",
                "Pembatasan ini berlaku meskipun kami telah diberitahu tentang kemungkinan kerugian tersebut.",
                "Beberapa yurisdiksi tidak mengizinkan pembatasan tertentu, sehingga pembatasan ini mungkin tidak berlaku untuk Anda.",
            ],
        },
        {
            id: "indemnification",
            title: "Ganti Rugi",
            content: [
                "Anda setuju untuk membebaskan, membela, dan mengganti rugi kami dari segala klaim, kerugian, atau biaya yang timbul dari:",
                "• Penggunaan layanan yang melanggar syarat ini",
                "• Pelanggaran hukum atau hak pihak ketiga",
                "• Konten yang Anda kirimkan atau publikasikan",
                "• Penggunaan layanan yang tidak sah atau melanggar hukum",
                "Kewajiban ganti rugi ini akan tetap berlaku setelah syarat ini berakhir.",
            ],
        },
        {
            id: "termination",
            title: "Penghentian",
            content: [
                "Kami berhak untuk menghentikan atau menangguhkan akses Anda ke layanan kapan saja, dengan atau tanpa alasan.",
                "Anda dapat menghentikan penggunaan layanan kapan saja dengan menghapus akun Anda.",
                "Setelah penghentian, hak Anda untuk menggunakan layanan akan berakhir segera.",
                "Ketentuan yang secara alami harus tetap berlaku setelah penghentian akan tetap efektif.",
            ],
        },
        {
            id: "governing-law",
            title: "Hukum yang Berlaku",
            content: [
                "Syarat ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia.",
                "Setiap sengketa yang timbul akan diselesaikan melalui pengadilan yang berwenang di Jakarta, Indonesia.",
                "Jika ada ketentuan dalam syarat ini yang dianggap tidak sah, ketentuan lainnya akan tetap berlaku.",
                "Kegagalan kami untuk menegakkan hak tidak berarti kami melepaskan hak tersebut.",
            ],
        },
    ];

    return (
        <div className="bg-[#E0E8EF] min-h-screen">
            {/* Hero Section */}
            <section className="bg-[#1A2A3A] text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Syarat dan Ketentuan
                        <span className="text-[#00FFFF]">.</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-6 text-gray-300 max-w-3xl mx-auto">
                        Ketentuan penggunaan layanan Chording yang perlu Anda ketahui dan patuhi.
                    </p>
                    <p className="text-lg text-gray-400">
                        Terakhir diperbarui: {lastUpdated}
                    </p>
                </div>
            </section>

            {/* Important Notice */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#00FFFF] bg-opacity-20 border-l-4 border-[#00FFFF] p-6 rounded-r-lg">
                        <h2 className="text-xl font-bold text-[#1A2A3A] mb-3 flex items-center">
                            <span className="mr-2">⚠️</span>
                            Pemberitahuan Penting
                        </h2>
                        <p className="text-gray-700">
                            Dengan menggunakan layanan Chording, Anda secara otomatis menyetujui semua syarat dan ketentuan yang tercantum di halaman ini.
                            Harap baca dengan seksama sebelum menggunakan layanan kami.
                        </p>
                    </div>
                </div>
            </section>

            {/* Table of Contents */}
            <section className="py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-[#00FFFF]">
                        <h2 className="text-2xl font-bold mb-6 text-[#1A2A3A]">Daftar Isi</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {termsSections.map((section, index) => (
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

            {/* Terms Content */}
            <section className="py-8 px-4">
                <div className="max-w-4xl mx-auto space-y-12">
                    {termsSections.map((section, index) => (
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

            {/* Quick Summary */}
            <section className="py-16 px-4 bg-[#1A2A3A] text-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center">
                        Ringkasan Syarat Utama
                        <span className="ml-2 text-[#00FFFF]">♪</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-[#2A3A4A] p-6 rounded-lg text-center">
                            <div className="text-4xl mb-4">✅</div>
                            <h3 className="text-xl font-semibold text-[#00FFFF] mb-3">Gunakan dengan Bijak</h3>
                            <p className="text-gray-300">Chord untuk pembelajaran dan penggunaan pribadi</p>
                        </div>
                        <div className="bg-[#2A3A4A] p-6 rounded-lg text-center">
                            <div className="text-4xl mb-4">🚫</div>
                            <h3 className="text-xl font-semibold text-[#00FFFF] mb-3">Jangan Disalahgunakan</h3>
                            <p className="text-gray-300">Tidak untuk tujuan komersial tanpa izin</p>
                        </div>
                        <div className="bg-[#2A3A4A] p-6 rounded-lg text-center">
                            <div className="text-4xl mb-4">🔒</div>
                            <h3 className="text-xl font-semibold text-[#00FFFF] mb-3">Jaga Keamanan</h3>
                            <p className="text-gray-300">Lindungi akun dan informasi Anda</p>
                        </div>
                        <div className="bg-[#2A3A4A] p-6 rounded-lg text-center">
                            <div className="text-4xl mb-4">📜</div>
                            <h3 className="text-xl font-semibold text-[#00FFFF] mb-3">Patuhi Aturan</h3>
                            <p className="text-gray-300">Ikuti syarat dan ketentuan yang berlaku</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact and Related Links */}
            <section className="py-16 px-4 bg-[#B0A0D0] bg-opacity-20">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-center text-[#1A2A3A]">
                        Pertanyaan tentang Syarat & Ketentuan
                        <span className="text-[#00FFFF]">?</span>
                    </h2>
                    <p className="text-center text-gray-700 mb-8">
                        Jika Anda memiliki pertanyaan tentang syarat ini, jangan ragu untuk menghubungi kami.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#00FFFF]">
                            <h3 className="text-xl font-semibold text-[#1A2A3A] mb-4">Hubungi Tim Legal</h3>
                            <div className="space-y-3">
                                <p className="text-gray-700">
                                    📧 Email: <a href="mailto:legal@chording.com" className="text-[#00FFFF] hover:underline">legal@chording.com</a>
                                </p>
                                <p className="text-gray-700">
                                    📱 WhatsApp: <a href="https://wa.me/6281234567890" className="text-[#00FFFF] hover:underline">+62 812-3456-7890</a>
                                </p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#00FFFF]">
                            <h3 className="text-xl font-semibold text-[#1A2A3A] mb-4">Dokumen Terkait</h3>
                            <div className="space-y-3">
                                <Link href="/privacy" className="block text-[#00FFFF] hover:underline">
                                    📋 Kebijakan Privasi
                                </Link>
                                <Link href="/faq" className="block text-[#00FFFF] hover:underline">
                                    ❓ Frequently Asked Questions
                                </Link>
                                <Link href="/contact" className="block text-[#00FFFF] hover:underline">
                                    💬 Halaman Kontak
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 text-center">
                        <Link
                            href="/"
                            className="inline-block px-8 py-4 bg-[#00FFFF] text-[#1A2A3A] rounded-md font-bold hover:bg-[#1A2A3A] hover:text-white transition-colors"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
