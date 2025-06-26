'use client';

import React, { useState, useEffect } from 'react';

const OAuthSetupGuide: React.FC = () => {
    const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({});
    const [supabaseProjectId, setSupabaseProjectId] = useState<string>('');

    useEffect(() => {
        // Extract project ID from Supabase URL
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (supabaseUrl) {
            const matches = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
            if (matches) {
                setSupabaseProjectId(matches[1]);
            }
        }
    }, []);

    const toggleStep = (stepId: string) => {
        setCompletedSteps(prev => ({
            ...prev,
            [stepId]: !prev[stepId]
        }));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    };

    const googleSteps = [
        {
            id: 'google-1',
            title: 'Buka Google Cloud Console',
            description: 'Kunjungi Google Cloud Console dan login dengan akun Google Anda',
            action: 'https://console.cloud.google.com/',
            type: 'link' as const
        },
        {
            id: 'google-2',
            title: 'Buat atau Pilih Project',
            description: 'Buat project baru dengan nama "Chording OAuth" atau pilih existing project',
            action: 'Buat project di Google Cloud Console',
            type: 'instruction' as const
        },
        {
            id: 'google-3',
            title: 'Aktifkan Google+ API',
            description: 'Di APIs & Services → Library, cari "Google+ API" atau "Google Identity" dan aktifkan',
            action: 'Enable Google+ API di Library',
            type: 'instruction' as const
        },
        {
            id: 'google-4',
            title: 'Buat OAuth 2.0 Credentials',
            description: 'Buat OAuth 2.0 Client ID dengan tipe "Web Application"',
            action: 'APIs & Services → Credentials → CREATE CREDENTIALS',
            type: 'instruction' as const
        },
        {
            id: 'google-5',
            title: 'Konfigurasi Authorized Origins',
            description: 'Tambahkan domain yang diizinkan untuk OAuth',
            action: `http://localhost:3000\nhttps://yourdomain.com`,
            type: 'copy' as const
        },
        {
            id: 'google-6',
            title: 'Konfigurasi Redirect URIs',
            description: 'Tambahkan URL callback Supabase',
            action: supabaseProjectId ?
                `https://${supabaseProjectId}.supabase.co/auth/v1/callback\nhttp://localhost:3000/auth/callback` :
                'https://YOUR_PROJECT.supabase.co/auth/v1/callback',
            type: 'copy' as const
        },
        {
            id: 'google-7',
            title: 'Setup di Supabase Dashboard',
            description: 'Masukkan Client ID dan Client Secret ke Supabase Authentication Providers',
            action: 'https://supabase.com/dashboard',
            type: 'link' as const
        }
    ];

    const facebookSteps = [
        {
            id: 'facebook-1',
            title: 'Buka Facebook Developers',
            description: 'Kunjungi Facebook for Developers dan login dengan akun Facebook Anda',
            action: 'https://developers.facebook.com/',
            type: 'link' as const
        },
        {
            id: 'facebook-2',
            title: 'Buat App Baru',
            description: 'Pilih "Create App" → "Consumer" → masukkan nama app "Chording"',
            action: 'Buat app baru di Facebook Developers',
            type: 'instruction' as const
        },
        {
            id: 'facebook-3',
            title: 'Tambahkan Facebook Login Product',
            description: 'Add Product → Facebook Login → Set Up → Web platform',
            action: 'Add Facebook Login Product',
            type: 'instruction' as const
        },
        {
            id: 'facebook-4',
            title: 'Konfigurasi OAuth Redirect URIs',
            description: 'Di Facebook Login Settings, tambahkan Valid OAuth Redirect URIs',
            action: supabaseProjectId ?
                `https://${supabaseProjectId}.supabase.co/auth/v1/callback\nhttp://localhost:3000/auth/callback` :
                'https://YOUR_PROJECT.supabase.co/auth/v1/callback',
            type: 'copy' as const
        },
        {
            id: 'facebook-5',
            title: 'Dapatkan App Credentials',
            description: 'Di Settings → Basic, salin App ID dan App Secret',
            action: 'Copy App ID dan App Secret',
            type: 'instruction' as const
        },
        {
            id: 'facebook-6',
            title: 'Setup di Supabase Dashboard',
            description: 'Masukkan App ID dan App Secret ke Supabase Authentication Providers',
            action: 'https://supabase.com/dashboard',
            type: 'link' as const
        },
        {
            id: 'facebook-7',
            title: 'Set App ke Live Mode',
            description: 'Untuk production, ubah app mode dari Development ke Live',
            action: 'App Review → Make App Live',
            type: 'instruction' as const
        }
    ];

    const [activeTab, setActiveTab] = useState<'google' | 'facebook'>('google');

    const currentSteps = activeTab === 'google' ? googleSteps : facebookSteps;
    const completedCount = currentSteps.filter(step => completedSteps[step.id]).length;

    const callbackUrl = supabaseProjectId ?
        `https://${supabaseProjectId}.supabase.co/auth/v1/callback` :
        "https://YOUR_PROJECT.supabase.co/auth/v1/callback";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1A2A3A] via-[#2A3A4A] to-[#1A2A3A] py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Setup OAuth untuk Chording<span className="text-[#00FFFF]">!</span>
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Panduan lengkap mengaktifkan login Google & Facebook
                    </p>
                    {supabaseProjectId && (
                        <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-400 rounded-lg">
                            <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-blue-400 text-sm">
                                Project ID: <code className="font-mono">{supabaseProjectId}</code>
                            </span>
                        </div>
                    )}
                </div>

                {/* Error Alert */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-semibold text-red-800 mb-2">
                                Error: "provider is not enabled"
                            </h3>
                            <p className="text-red-700 mb-4">
                                Jika Anda mendapat error ini, berarti OAuth provider belum diaktifkan di Supabase Dashboard.
                                Ikuti langkah-langkah di bawah untuk mengaktifkannya.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('google')}
                            className={`flex-1 py-4 px-6 font-semibold transition-colors ${activeTab === 'google'
                                ? 'bg-[#00FFFF] text-[#1A2A3A]'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <div className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google OAuth
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('facebook')}
                            className={`flex-1 py-4 px-6 font-semibold transition-colors ${activeTab === 'facebook'
                                ? 'bg-[#00FFFF] text-[#1A2A3A]'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <div className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook OAuth
                            </div>
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-6 py-4 bg-gray-50 border-b">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-700">
                                Progress: {completedCount}/{currentSteps.length} steps
                            </span>
                            <span className="text-sm text-gray-500">
                                {Math.round((completedCount / currentSteps.length) * 100)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-[#00FFFF] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(completedCount / currentSteps.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="p-6">
                        <div className="space-y-4">
                            {currentSteps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className={`p-4 rounded-lg border-2 transition-all ${completedSteps[step.id]
                                        ? 'border-green-200 bg-green-50'
                                        : 'border-gray-200 bg-white hover:border-[#00FFFF]'
                                        }`}
                                >
                                    <div className="flex items-start">
                                        <button
                                            onClick={() => toggleStep(step.id)}
                                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-4 mt-1 transition-all flex items-center justify-center ${completedSteps[step.id]
                                                ? 'border-green-500 bg-green-500'
                                                : 'border-gray-300 hover:border-[#00FFFF]'
                                                }`}
                                        >
                                            {completedSteps[step.id] && (
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold text-gray-900">
                                                    {index + 1}. {step.title}
                                                </h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${completedSteps[step.id]
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {completedSteps[step.id] ? 'Completed' : 'Pending'}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-3">{step.description}</p>

                                            {/* Action Button/Content */}
                                            {step.type === 'link' && (
                                                <a
                                                    href={step.action}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    Open Link
                                                </a>
                                            )}

                                            {step.type === 'copy' && (
                                                <div className="bg-gray-100 rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-gray-700">Copy URLs:</span>
                                                        <button
                                                            onClick={() => copyToClipboard(step.action)}
                                                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                            Copy
                                                        </button>
                                                    </div>
                                                    <code className="text-sm text-gray-600 block whitespace-pre-line font-mono">
                                                        {step.action}
                                                    </code>
                                                </div>
                                            )}

                                            {step.type === 'instruction' && (
                                                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                                                    <p className="text-blue-800 text-sm font-medium">{step.action}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Fix */}
                <div className="bg-white rounded-lg shadow-xl p-8 mb-8 border-t-4 border-[#00FFFF]">
                    <h2 className="text-2xl font-bold text-[#1A2A3A] mb-6">🚀 Solusi Cepat</h2>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <span className="bg-[#00FFFF] text-[#1A2A3A] rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">1</span>
                            <div>
                                <p className="font-semibold">Buka Supabase Dashboard</p>
                                <a
                                    href="https://supabase.com/dashboard"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#00FFFF] hover:underline"
                                >
                                    https://supabase.com/dashboard
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <span className="bg-[#00FFFF] text-[#1A2A3A] rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">2</span>
                            <div>
                                <p className="font-semibold">Pilih project Chording</p>
                                <p className="text-gray-600">Cari project dengan nama "Chording" atau ID yang sesuai</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <span className="bg-[#00FFFF] text-[#1A2A3A] rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">3</span>
                            <div>
                                <p className="font-semibold">Navigasi ke Authentication → Providers</p>
                                <p className="text-gray-600">Cari menu di sidebar kiri</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <span className="bg-[#00FFFF] text-[#1A2A3A] rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">4</span>
                            <div>
                                <p className="font-semibold">Enable provider yang diperlukan</p>
                                <p className="text-gray-600">Toggle switch untuk Google dan/atau Facebook</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Google Setup */}
                <div className="bg-white rounded-lg shadow-xl p-8 mb-8 border-t-4 border-red-500">
                    <h2 className="text-2xl font-bold text-[#1A2A3A] mb-6 flex items-center">
                        <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google OAuth Setup
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-3">1. Buat Google OAuth App</h3>
                            <ol className="list-decimal list-inside space-y-2 text-gray-700">
                                <li>Buka <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                                <li>Buat project baru atau pilih project yang ada</li>
                                <li>Enable <strong>Google+ API</strong> dan <strong>Google Identity API</strong></li>
                                <li>Ke <strong>APIs & Services</strong> → <strong>Credentials</strong> → <strong>Create Credentials</strong> → <strong>OAuth 2.0 Client ID</strong></li>
                            </ol>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3">2. Konfigurasi OAuth Client</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Application Type</label>
                                        <div className="bg-white border rounded p-2">Web Application</div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Name</label>
                                        <div className="bg-white border rounded p-2">Chording</div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium mb-2">Authorized Redirect URIs</label>
                                    <div className="bg-white border rounded p-2 flex items-center justify-between">
                                        <code className="text-sm">{callbackUrl}</code>
                                        <button
                                            onClick={() => copyToClipboard(callbackUrl)}
                                            className="ml-2 px-3 py-1 bg-[#00FFFF] text-[#1A2A3A] rounded text-sm hover:bg-[#B0A0D0]"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3">3. Setup di Supabase</h3>
                            <ol className="list-decimal list-inside space-y-2 text-gray-700">
                                <li>Di Supabase Dashboard → <strong>Authentication</strong> → <strong>Providers</strong></li>
                                <li><strong>Enable Google</strong> (toggle switch)</li>
                                <li>Masukkan <strong>Client ID</strong> dan <strong>Client Secret</strong> dari Google Console</li>
                                <li>Klik <strong>Save</strong></li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Facebook Setup */}
                <div className="bg-white rounded-lg shadow-xl p-8 mb-8 border-t-4 border-blue-600">
                    <h2 className="text-2xl font-bold text-[#1A2A3A] mb-6 flex items-center">
                        <svg className="w-8 h-8 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook OAuth Setup
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-3">1. Buat Facebook App</h3>
                            <ol className="list-decimal list-inside space-y-2 text-gray-700">
                                <li>Buka <a href="https://developers.facebook.com/" target="_blank" className="text-blue-600 hover:underline">Facebook Developers</a></li>
                                <li>Klik <strong>Create App</strong> → <strong>Consumer</strong> → <strong>Next</strong></li>
                                <li>Masukkan nama app: <strong>Chording</strong></li>
                                <li>Tambahkan <strong>Facebook Login</strong> product</li>
                            </ol>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3">2. Konfigurasi Facebook Login</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Valid OAuth Redirect URIs</label>
                                    <div className="bg-white border rounded p-2 flex items-center justify-between">
                                        <code className="text-sm">{callbackUrl}</code>
                                        <button
                                            onClick={() => copyToClipboard(callbackUrl)}
                                            className="ml-2 px-3 py-1 bg-[#00FFFF] text-[#1A2A3A] rounded text-sm hover:bg-[#B0A0D0]"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Client OAuth Login</label>
                                        <div className="bg-white border rounded p-2">Yes</div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Web OAuth Login</label>
                                        <div className="bg-white border rounded p-2">Yes</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3">3. Setup di Supabase</h3>
                            <ol className="list-decimal list-inside space-y-2 text-gray-700">
                                <li>Di Supabase Dashboard → <strong>Authentication</strong> → <strong>Providers</strong></li>
                                <li><strong>Enable Facebook</strong> (toggle switch)</li>
                                <li>Masukkan <strong>App ID</strong> dan <strong>App Secret</strong> dari Facebook</li>
                                <li>Klik <strong>Save</strong></li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Testing */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-green-800 mb-4">✅ Testing OAuth</h2>
                    <ol className="list-decimal list-inside space-y-2 text-green-700">
                        <li>Buka halaman <a href="/login" className="text-green-600 hover:underline">/login</a></li>
                        <li>Klik tombol Google atau Facebook</li>
                        <li>Harus redirect ke provider OAuth</li>
                        <li>Setelah authorize, redirect kembali ke aplikasi</li>
                        <li>User harus ter-authenticate dan login berhasil</li>
                    </ol>
                </div>

                {/* Important URLs */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-yellow-800 mb-4">📋 URL Penting</h2>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-yellow-700 mb-1">Supabase Callback URL</label>
                            <div className="bg-white border rounded p-2 flex items-center justify-between">
                                <code className="text-sm">{callbackUrl}</code>
                                <button
                                    onClick={() => copyToClipboard(callbackUrl)}
                                    className="ml-2 px-3 py-1 bg-yellow-400 text-yellow-800 rounded text-sm hover:bg-yellow-300"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-yellow-700 mb-1">Development Callback</label>
                            <div className="bg-white border rounded p-2 flex items-center justify-between">
                                <code className="text-sm">http://localhost:3000/auth/callback</code>
                                <button
                                    onClick={() => copyToClipboard('http://localhost:3000/auth/callback')}
                                    className="ml-2 px-3 py-1 bg-yellow-400 text-yellow-800 rounded text-sm hover:bg-yellow-300"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OAuthSetupGuide;
