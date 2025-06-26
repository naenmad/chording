'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/supabase';

const RegisterPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Password tidak cocok!');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password minimal 6 karakter!');
            return;
        }

        if (!agreedToTerms) {
            setError('Anda harus menyetujui syarat dan ketentuan!');
            return;
        }

        setIsLoading(true); try {
            const { data, error: authError } = await authAPI.signUp(
                formData.email,
                formData.password,
                formData.fullName
            );

            if (authError) {
                setError(authError.message);
                return;
            }

            if (data.user) {
                // Create initial profile record
                await authAPI.createInitialProfile(data.user.id, {
                    full_name: formData.fullName,
                    email: formData.email
                });

                setSuccess('Akun berhasil dibuat! Silakan cek email Anda untuk verifikasi.');

                // Check if user is automatically logged in (depends on Supabase settings)
                if (data.session) {
                    // User is logged in, redirect to onboarding after a short delay
                    setTimeout(() => {
                        router.push('/onboarding');
                    }, 2000);
                } else {
                    // User needs to verify email first
                    setTimeout(() => {
                        router.push('/login');
                    }, 3000);
                }
            }
        } catch (err: any) {
            setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        try {
            setError(''); // Clear previous errors
            const { error } = await authAPI.signInWithOAuth('google');
            if (error) {
                // Handle specific OAuth errors
                if (error.message.includes('provider is not enabled')) {
                    setError('Pendaftaran dengan Google belum diaktifkan. Silakan hubungi administrator.');
                } else if (error.message.includes('validation_failed')) {
                    setError('Konfigurasi Google tidak valid. Silakan coba lagi nanti.');
                } else {
                    setError(error.message);
                }
            }
            // If no error, user will be redirected by Supabase
        } catch (err: any) {
            console.error('Google OAuth Error:', err);
            setError('Terjadi kesalahan saat daftar dengan Google. Silakan coba lagi.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1A2A3A] via-[#2A3A4A] to-[#1A2A3A] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link href="/" className="inline-block">
                        <h1 className="text-4xl font-bold text-white group-hover:text-[#00FFFF] transition-colors">
                            Chording<span className="text-[#00FFFF]">!</span>
                        </h1>
                    </Link>
                    <h2 className="mt-6 text-2xl font-semibold text-white">
                        Buat Akun Baru
                    </h2>
                    <p className="mt-2 text-gray-300">
                        Bergabunglah dengan komunitas musisi
                    </p>
                </div>                {/* Register Form */}
                <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-[#00FFFF]">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="text-red-700 text-sm">{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-green-700 text-sm">{success}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name Field */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                Nama Lengkap
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent outline-none transition-colors"
                                placeholder="Masukkan nama lengkap Anda"
                            />
                        </div>

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
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent outline-none transition-colors"
                                placeholder="Masukkan email Anda"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent outline-none transition-colors"
                                    placeholder="Minimal 8 karakter"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#1A2A3A]"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                Konfirmasi Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent outline-none transition-colors"
                                    placeholder="Ulangi password Anda"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#1A2A3A]"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Terms Agreement */}
                        <div className="flex items-start">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="h-4 w-4 text-[#00FFFF] focus:ring-[#00FFFF] border-gray-300 rounded mt-1"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                Saya setuju dengan{' '}
                                <Link href="/terms" className="text-[#00FFFF] hover:text-[#1A2A3A] transition-colors">
                                    Syarat dan Ketentuan
                                </Link>
                                {' '}serta{' '}
                                <Link href="/privacy" className="text-[#00FFFF] hover:text-[#1A2A3A] transition-colors">
                                    Kebijakan Privasi
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !agreedToTerms}
                            className="w-full bg-[#00FFFF] text-[#1A2A3A] py-3 px-4 rounded-lg font-semibold hover:bg-[#B0A0D0] focus:ring-2 focus:ring-[#00FFFF] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Memproses...
                                </div>
                            ) : (
                                'Daftar Sekarang'
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
                                <span className="px-2 bg-white text-gray-500">Atau daftar dengan</span>
                            </div>
                        </div>
                    </div>

                    {/* Google Register */}
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={handleGoogleRegister}
                            className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="ml-3">Daftar dengan Google</span>
                        </button>
                    </div>

                    {/* Login Link */}
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Sudah punya akun?{' '}
                        <Link href="/login" className="font-medium text-[#00FFFF] hover:text-[#1A2A3A] transition-colors">
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
