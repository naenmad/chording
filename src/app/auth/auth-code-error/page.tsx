'use client';

import Link from 'next/link';

const AuthCodeErrorPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1A2A3A] via-[#2A3A4A] to-[#1A2A3A] flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link href="/" className="inline-block">
                        <h1 className="text-4xl font-bold text-white group-hover:text-[#00FFFF] transition-colors">
                            Chording<span className="text-[#00FFFF]">!</span>
                        </h1>
                    </Link>
                </div>

                {/* Error Message */}
                <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-red-500 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-semibold text-[#1A2A3A] mb-4">
                        Authentication Error
                    </h2>

                    <p className="text-gray-600 mb-6">
                        Maaf, terjadi kesalahan saat proses autentikasi.
                        Silakan coba lagi atau hubungi support jika masalah berlanjut.
                    </p>

                    <div className="space-y-3">
                        <Link
                            href="/login"
                            className="block w-full bg-[#00FFFF] text-[#1A2A3A] py-3 px-4 rounded-lg font-semibold hover:bg-[#B0A0D0] transition-colors"
                        >
                            Kembali ke Login
                        </Link>

                        <Link
                            href="/"
                            className="block w-full bg-transparent border-2 border-[#1A2A3A] text-[#1A2A3A] py-3 px-4 rounded-lg font-semibold hover:bg-[#1A2A3A] hover:text-white transition-colors"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>

                    <p className="mt-6 text-sm text-gray-500">
                        Jika masalah berlanjut, silakan hubungi tim support kami.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthCodeErrorPage;
