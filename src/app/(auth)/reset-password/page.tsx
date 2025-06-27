'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authAPI } from '@/lib/supabase';

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { error: resetError } = await authAPI.resetPassword(email);

            if (resetError) {
                setError(resetError.message);
                setIsLoading(false);
                return;
            }

            setIsSubmitted(true);
        } catch (err: any) {
            setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
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

                    {/* Success Message */}
                    <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-[#00FFFF] text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-semibold text-[#1A2A3A] mb-4">
                            Email Terkirim!
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Kami telah mengirimkan instruksi reset password ke email <strong>{email}</strong>.
                            Silakan cek kotak masuk Anda (dan folder spam jika perlu).
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setEmail('');
                                }}
                                className="w-full bg-[#00FFFF] text-[#1A2A3A] py-3 px-4 rounded-lg font-semibold hover:bg-[#B0A0D0] transition-colors"
                            >
                                Kirim Ulang Email
                            </button>

                            <Link
                                href="/login"
                                className="block w-full bg-transparent border-2 border-[#1A2A3A] text-[#1A2A3A] py-3 px-4 rounded-lg font-semibold hover:bg-[#1A2A3A] hover:text-white transition-colors text-center"
                            >
                                Kembali ke Login
                            </Link>
                        </div>

                        <p className="mt-6 text-sm text-gray-500">
                            Tidak menerima email? Tunggu beberapa menit atau cek folder spam Anda.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

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
                    <h2 className="mt-6 text-2xl font-semibold text-white">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-gray-300">
                        Masukkan email Anda untuk menerima instruksi reset password
                    </p>
                </div>

                {/* Reset Password Form */}
                <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-[#00FFFF]">
                    <div className="mb-6 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-600">
                            Jangan khawatir! Masukkan email yang terdaftar dan kami akan mengirimkan link untuk reset password Anda.
                        </p>
                    </div>                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-800">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError(''); // Clear error when user starts typing
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent outline-none transition-colors text-gray-900 placeholder-gray-500"
                                placeholder="Masukkan email Anda"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#00FFFF] text-[#1A2A3A] py-3 px-4 rounded-lg font-semibold hover:bg-[#B0A0D0] focus:ring-2 focus:ring-[#00FFFF] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Mengirim Email...
                                </div>
                            ) : (
                                'Kirim Instruksi Reset'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Atau</span>
                            </div>
                        </div>
                    </div>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center text-sm text-[#00FFFF] hover:text-[#1A2A3A] transition-colors"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali ke Login
                        </Link>
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Butuh Bantuan?</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Pastikan email yang Anda masukkan benar</li>
                            <li>• Cek folder spam jika email tidak masuk</li>
                            <li>• Link reset password akan kadaluarsa dalam 24 jam</li>
                            <li>• Hubungi <Link href="/contact" className="text-[#00FFFF] hover:underline">support</Link> jika masih bermasalah</li>
                        </ul>
                    </div>

                    {/* Register Link */}
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Belum punya akun?{' '}
                        <Link href="/register" className="font-medium text-[#00FFFF] hover:text-[#1A2A3A] transition-colors">
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
