'use client';

import { useState, useEffect } from 'react';
import { authAPI } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export default function DatabaseDebugPage() {
    const { user, loading } = useAuth();
    const [debugResults, setDebugResults] = useState<any>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isCreatingPreferences, setIsCreatingPreferences] = useState(false);

    const runDatabaseDebug = async () => {
        if (!user) {
            setDebugResults({ error: 'No user logged in' });
            return;
        }

        setIsRunning(true);
        try {
            const results = await authAPI.debugDatabaseAccess(user.id);
            setDebugResults(results);
        } catch (error) {
            setDebugResults({ error: String(error) });
        } finally {
            setIsRunning(false);
        }
    }; const createUserPreferences = async () => {
        if (!user) return;

        setIsCreatingPreferences(true);
        try {
            const { data, error } = await authAPI.createDefaultUserPreferences(user.id);

            if (error) {
                console.error('Error creating user preferences:', error);
                alert(`Error creating preferences: ${error ? (typeof error === 'object' && 'message' in error ? error.message : JSON.stringify(error)) : 'Unknown error'}`);
            } else {
                console.log('User preferences created successfully:', data);
                alert('User preferences berhasil dibuat!');
                // Refresh debug results
                await runDatabaseDebug();
            }
        } catch (error) {
            console.error('Error in createUserPreferences:', error);
            alert(`Error: ${String(error)}`);
        } finally {
            setIsCreatingPreferences(false);
        }
    };

    useEffect(() => {
        if (user && !loading) {
            runDatabaseDebug();
        }
    }, [user, loading]); if (loading) {
        return (
            <div className="bg-[#E0E8EF] min-h-screen">
                <div className="max-w-7xl mx-auto px-4 py-20">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🔧</div>
                        <h1 className="text-2xl font-bold text-[#1A2A3A] mb-4">Loading Debug Information...</h1>
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FFFF]"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="bg-[#E0E8EF] min-h-screen">
                {/* Hero Section */}
                <section className="bg-[#1A2A3A] text-white py-20 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="text-6xl mb-6">🔧</div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Database Debug
                            <span className="text-[#00FFFF]">.</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto">
                            Silakan login terlebih dahulu untuk menjalankan diagnosa database.
                        </p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="bg-[#E0E8EF] min-h-screen">
            {/* Hero Section */}
            <section className="bg-[#1A2A3A] text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="text-6xl mb-6">🔧</div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Database Debug Information
                        <span className="text-[#00FFFF]">.</span>
                    </h1>                    <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto">
                        Diagnosa konektivitas dan permission database Chording.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={runDatabaseDebug}
                            disabled={isRunning}
                            className="px-8 py-4 bg-[#00FFFF] text-[#1A2A3A] rounded-md font-bold hover:bg-[#B0A0D0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isRunning ? 'Menjalankan Test...' : 'Jalankan Debug Test'}
                        </button>

                        {debugResults && !debugResults.userPreferencesExist && (
                            <button
                                onClick={createUserPreferences}
                                disabled={isCreatingPreferences}
                                className="px-8 py-4 bg-green-600 text-white rounded-md font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCreatingPreferences ? 'Membuat Preferences...' : 'Buat User Preferences'}
                            </button>
                        )}
                    </div>
                </div>
            </section>            {/* Debug Results Section */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    {debugResults && (
                        <div className="space-y-6">
                            {/* User Information Card */}
                            <div className="bg-white rounded-lg overflow-hidden shadow-md border-t-4 border-[#00FFFF]">
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-[#1A2A3A] mb-4 flex items-center">
                                        <span className="mr-2">👤</span>
                                        Informasi User
                                    </h2>
                                    <div className="bg-[#E0E8EF] p-4 rounded-lg">
                                        <pre className="text-sm whitespace-pre-wrap text-[#1A2A3A] overflow-x-auto">
                                            {JSON.stringify({
                                                id: user.id,
                                                email: user.email,
                                                created_at: user.created_at,
                                                last_sign_in_at: user.last_sign_in_at
                                            }, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            {/* Database Access Results Card */}
                            <div className="bg-white rounded-lg overflow-hidden shadow-md border-t-4 border-[#00FFFF]">
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-[#1A2A3A] mb-4 flex items-center">
                                        <span className="mr-2">🗄️</span>
                                        Status Akses Database
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className={`p-4 rounded-lg border-2 ${debugResults.canAccessProfiles ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-3">{debugResults.canAccessProfiles ? '✅' : '❌'}</span>
                                                <div>
                                                    <h3 className="font-semibold text-[#1A2A3A]">Tabel Profiles</h3>
                                                    <p className={`text-sm ${debugResults.canAccessProfiles ? 'text-green-700' : 'text-red-700'}`}>
                                                        {debugResults.canAccessProfiles ? 'Berhasil Diakses' : 'Gagal Diakses'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`p-4 rounded-lg border-2 ${debugResults.canAccessUserPreferences ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-3">{debugResults.canAccessUserPreferences ? '✅' : '❌'}</span>
                                                <div>
                                                    <h3 className="font-semibold text-[#1A2A3A]">Tabel User Preferences</h3>
                                                    <p className={`text-sm ${debugResults.canAccessUserPreferences ? 'text-green-700' : 'text-red-700'}`}>
                                                        {debugResults.canAccessUserPreferences ? 'Berhasil Diakses' : 'Gagal Diakses'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`p-4 rounded-lg border-2 ${debugResults.profileExists ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-3">{debugResults.profileExists ? '✅' : '⚠️'}</span>
                                                <div>
                                                    <h3 className="font-semibold text-[#1A2A3A]">Profile User</h3>
                                                    <p className={`text-sm ${debugResults.profileExists ? 'text-green-700' : 'text-yellow-700'}`}>
                                                        {debugResults.profileExists ? 'Profile Ditemukan' : 'Profile Tidak Ditemukan'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`p-4 rounded-lg border-2 ${debugResults.userPreferencesExist ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-3">{debugResults.userPreferencesExist ? '✅' : '⚠️'}</span>
                                                <div>
                                                    <h3 className="font-semibold text-[#1A2A3A]">User Preferences</h3>
                                                    <p className={`text-sm ${debugResults.userPreferencesExist ? 'text-green-700' : 'text-yellow-700'}`}>
                                                        {debugResults.userPreferencesExist ? 'Preferences Ditemukan' : 'Preferences Tidak Ditemukan'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Errors Card */}
                            {debugResults.errors && debugResults.errors.length > 0 && (
                                <div className="bg-white rounded-lg overflow-hidden shadow-md border-t-4 border-red-500">
                                    <div className="p-6">
                                        <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                                            <span className="mr-2">🚨</span>
                                            Error Ditemukan
                                        </h2>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                            <ul className="space-y-2">
                                                {debugResults.errors.map((error: string, index: number) => (
                                                    <li key={index} className="text-red-700 text-sm flex items-start">
                                                        <span className="mr-2 text-red-500">•</span>
                                                        <span>{error}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Raw Debug Data Card */}
                            <div className="bg-white rounded-lg overflow-hidden shadow-md border-t-4 border-[#1A2A3A]">
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-[#1A2A3A] mb-4 flex items-center">
                                        <span className="mr-2">📋</span>
                                        Data Debug Lengkap
                                    </h2>
                                    <div className="bg-[#1A2A3A] p-4 rounded-lg">
                                        <pre className="text-xs whitespace-pre-wrap overflow-x-auto text-[#00FFFF] font-mono">
                                            {JSON.stringify(debugResults, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            {/* Recommendations Card */}
                            <div className="bg-white rounded-lg overflow-hidden shadow-md border-t-4 border-blue-500">
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-[#1A2A3A] mb-4 flex items-center">
                                        <span className="mr-2">💡</span>
                                        Rekomendasi
                                    </h2>
                                    <div className="space-y-3">
                                        {!debugResults.canAccessProfiles && (
                                            <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                                                <p className="text-red-700 text-sm">
                                                    <strong>Tidak dapat mengakses tabel profiles:</strong> Periksa RLS policies dan pastikan user memiliki permission yang tepat.
                                                </p>
                                            </div>
                                        )}

                                        {!debugResults.canAccessUserPreferences && (
                                            <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                                                <p className="text-red-700 text-sm">
                                                    <strong>Tidak dapat mengakses tabel user_preferences:</strong> Periksa RLS policies dan pastikan tabel sudah dibuat dengan benar.
                                                </p>
                                            </div>
                                        )}

                                        {!debugResults.profileExists && debugResults.canAccessProfiles && (
                                            <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                                                <p className="text-yellow-700 text-sm">
                                                    <strong>Profile tidak ditemukan:</strong> Profile akan dibuat otomatis saat onboarding atau login pertama kali.
                                                </p>
                                            </div>
                                        )}

                                        {!debugResults.userPreferencesExist && debugResults.canAccessUserPreferences && (
                                            <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                                                <p className="text-blue-700 text-sm">
                                                    <strong>User preferences tidak ditemukan:</strong> Klik tombol "Buat User Preferences" di atas untuk membuat preferences default.
                                                </p>
                                            </div>
                                        )}

                                        {debugResults.canAccessProfiles && debugResults.canAccessUserPreferences && debugResults.profileExists && debugResults.userPreferencesExist && (
                                            <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                                                <p className="text-green-700 text-sm">
                                                    <strong>Semuanya berfungsi dengan baik!</strong> Database setup Anda sudah lengkap dan berfungsi dengan baik.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!debugResults && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔍</div>
                            <h2 className="text-2xl font-bold text-[#1A2A3A] mb-4">
                                Klik tombol di atas untuk menjalankan diagnosa
                            </h2>
                            <p className="text-gray-600">
                                Debug test akan membantu mengidentifikasi masalah database dan permission.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
