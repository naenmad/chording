'use client';

import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createSupabaseClient, authAPI } from '@/lib/supabase';

interface OnboardingFlowProps {
    user: User;
    onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ user, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        full_name: user.user_metadata?.full_name || '',
        username: '',
        bio: '',
        location: '',
        favorite_genre: '',
        skill_level: 'beginner',
        primary_instrument: 'guitar'
    });

    const supabase = createSupabaseClient();

    const steps = [
        {
            id: 'welcome',
            title: 'Selamat Datang di Chording!',
            subtitle: 'Mari kita setup profil Anda',
            icon: '🎸'
        },
        {
            id: 'profile',
            title: 'Lengkapi Profil Anda',
            subtitle: 'Ceritakan sedikit tentang diri Anda',
            icon: '👤'
        },
        {
            id: 'preferences',
            title: 'Preferensi Musik',
            subtitle: 'Bantu kami menyesuaikan pengalaman Anda',
            icon: '🎵'
        },
        {
            id: 'tutorial',
            title: 'Tutorial Singkat',
            subtitle: 'Pelajari fitur-fitur utama Chording',
            icon: '📚'
        },
        {
            id: 'complete',
            title: 'Semuanya Siap!',
            subtitle: 'Anda sudah siap menggunakan Chording',
            icon: '🎉'
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    }; const handleComplete = async () => {
        setIsLoading(true);
        try {
            console.log('Completing onboarding for user:', user.id);
            console.log('Profile data to save:', profileData);

            // First, check if profiles table exists and user can access it
            const { data: testAccess, error: accessError } = await supabase
                .from('profiles')
                .select('count', { count: 'exact', head: true });

            if (accessError) {
                console.error('Cannot access profiles table:', accessError);
                throw new Error(`Database access error: ${accessError.message || JSON.stringify(accessError)}`);
            }

            console.log('Database access confirmed');

            // Check if profile exists
            const { data: existingProfile, error: profileCheckError } = await supabase
                .from('profiles')
                .select('id, onboarding_completed')
                .eq('id', user.id)
                .single();

            console.log('Existing profile check result:', { existingProfile, profileCheckError });            // Prepare profile data for upsert
            const profileUpsertData = {
                id: user.id,
                full_name: profileData.full_name,
                username: profileData.username,
                bio: profileData.bio,
                location: profileData.location,
                email: user.email,
                onboarding_completed: true,
                updated_at: new Date().toISOString(),
                created_at: existingProfile ? undefined : new Date().toISOString()
            };

            console.log('Profile upsert data:', profileUpsertData);

            // Save profile data with explicit error handling
            const { data: profileResult, error: profileError } = await supabase
                .from('profiles')
                .upsert(profileUpsertData, {
                    onConflict: 'id'
                })
                .select();

            if (profileError) {
                console.error('Error saving profile:', {
                    error: profileError,
                    message: profileError.message,
                    details: profileError.details,
                    hint: profileError.hint,
                    code: profileError.code
                });
                throw new Error(`Profile save failed: ${profileError.message || JSON.stringify(profileError)}`);
            } console.log('Profile saved successfully:', profileResult);

            // Save user preferences using helper function
            console.log('Saving user preferences...'); try {
                const { data: preferencesResult, error: preferencesError } = await authAPI.createDefaultUserPreferences(user.id);

                let preferencesSaved = false;

                if (preferencesError) {
                    console.error('Error saving preferences via helper:', preferencesError);

                    // Try manual upsert as fallback
                    console.log('Trying manual preferences upsert as fallback...');
                    const preferencesUpsertData = {
                        user_id: user.id,
                        favorite_genre: profileData.favorite_genre || '',
                        skill_level: profileData.skill_level || 'beginner',
                        primary_instrument: profileData.primary_instrument || 'guitar',
                        email_notifications: true,
                        practice_reminders: false,
                        new_features: true,
                        marketing_emails: false,
                        auto_scroll_speed: 'medium',
                        default_instrument: profileData.primary_instrument || 'guitar',
                        chord_display: 'diagram',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    };

                    console.log('Fallback preferences upsert data:', preferencesUpsertData);

                    const { data: fallbackResult, error: fallbackError } = await supabase
                        .from('user_preferences')
                        .upsert(preferencesUpsertData, {
                            onConflict: 'user_id'
                        })
                        .select();

                    if (fallbackError) {
                        console.error('Error saving preferences (fallback):', fallbackError);
                        console.warn('Preferences could not be saved, but continuing with onboarding');
                    } else {
                        console.log('Preferences saved successfully (fallback):', fallbackResult);
                        preferencesSaved = true;
                    }
                } else {
                    console.log('Preferences saved successfully via helper:', preferencesResult);
                    preferencesSaved = true;
                }

                // Store preferences save status for completion message
                (window as any).preferencesWereSaved = preferencesSaved;

            } catch (preferencesException) {
                console.error('Exception while saving preferences:', preferencesException);
                console.warn('Preferences save failed, but continuing with onboarding');
                (window as any).preferencesWereSaved = false;
            }

            console.log('Onboarding completed successfully');
            onComplete();
        } catch (error) {
            console.error('Error completing onboarding:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            alert(`Ada masalah saat menyelesaikan onboarding: ${errorMessage}\n\nSilakan periksa console untuk detail lebih lanjut.`);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (steps[currentStep].id) {
            case 'welcome':
                return (
                    <div className="text-center space-y-6">
                        <div className="text-6xl mb-4">{steps[currentStep].icon}</div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#1A2A3A] mb-2">
                                Halo, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Terima kasih telah bergabung dengan Chording! Mari kita siapkan akun Anda
                                agar pengalaman belajar chord menjadi lebih personal dan menyenangkan.
                            </p>
                            <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-[#1A2A3A] mb-2">Yang akan kita lakukan:</h3>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>✓ Lengkapi profil Anda</li>
                                    <li>✓ Atur preferensi musik</li>
                                    <li>✓ Pelajari fitur-fitur utama</li>
                                    <li>✓ Mulai menjelajahi chord favorit</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'profile':
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <div className="text-4xl mb-2">{steps[currentStep].icon}</div>
                            <h2 className="text-xl font-bold text-[#1A2A3A]">Lengkapi Profil Anda</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Nama Lengkap
                                </label>                                <input
                                    type="text"
                                    value={profileData.full_name}
                                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A] bg-white"
                                    placeholder="Masukkan nama lengkap Anda"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Username
                                </label>                                <input
                                    type="text"
                                    value={profileData.username}
                                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A] bg-white"
                                    placeholder="Pilih username unik"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Bio
                                </label>                                <textarea
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A] bg-white"
                                    placeholder="Ceritakan sedikit tentang diri Anda..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Lokasi (Opsional)
                                </label>                                <input
                                    type="text"
                                    value={profileData.location}
                                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A] bg-white"
                                    placeholder="Kota, Negara"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'preferences':
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <div className="text-4xl mb-2">{steps[currentStep].icon}</div>
                            <h2 className="text-xl font-bold text-[#1A2A3A]">Preferensi Musik Anda</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Genre Favorit
                                </label>                                <select
                                    value={profileData.favorite_genre}
                                    onChange={(e) => setProfileData({ ...profileData, favorite_genre: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A] bg-white"
                                >
                                    <option value="">Pilih genre favorit</option>
                                    <option value="pop">Pop</option>
                                    <option value="rock">Rock</option>
                                    <option value="jazz">Jazz</option>
                                    <option value="blues">Blues</option>
                                    <option value="folk">Folk</option>
                                    <option value="country">Country</option>
                                    <option value="dangdut">Dangdut</option>
                                    <option value="alternative">Alternative</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Level Skill
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['beginner', 'intermediate', 'advanced'].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setProfileData({ ...profileData, skill_level: level })} className={`p-3 rounded-lg border-2 transition-colors ${profileData.skill_level === level
                                                ? 'border-[#00FFFF] bg-[#E0E8EF] text-[#1A2A3A]'
                                                : 'border-gray-300 hover:border-gray-400 text-[#1A2A3A] bg-white'
                                                }`}
                                        >
                                            <div className="text-sm font-medium capitalize">{level}</div>
                                            <div className="text-xs text-gray-500">
                                                {level === 'beginner' && 'Baru mulai'}
                                                {level === 'intermediate' && 'Sudah bisa beberapa chord'}
                                                {level === 'advanced' && 'Sudah mahir'}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Instrumen Utama
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'guitar', name: 'Gitar', icon: '🎸' },
                                        { id: 'ukulele', name: 'Ukulele', icon: '🎶' },
                                        { id: 'piano', name: 'Piano', icon: '🎹' },
                                        { id: 'other', name: 'Lainnya', icon: '🎵' }
                                    ].map((instrument) => (
                                        <button
                                            key={instrument.id}
                                            onClick={() => setProfileData({ ...profileData, primary_instrument: instrument.id })} className={`p-3 rounded-lg border-2 transition-colors ${profileData.primary_instrument === instrument.id
                                                ? 'border-[#00FFFF] bg-[#E0E8EF] text-[#1A2A3A]'
                                                : 'border-gray-300 hover:border-gray-400 text-[#1A2A3A] bg-white'
                                                }`}
                                        >
                                            <div className="text-lg mb-1">{instrument.icon}</div>
                                            <div className="text-sm font-medium">{instrument.name}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'tutorial':
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <div className="text-4xl mb-2">{steps[currentStep].icon}</div>
                            <h2 className="text-xl font-bold text-[#1A2A3A]">Fitur-Fitur Utama</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                <div className="flex items-start space-x-3">
                                    <div className="text-2xl">🔍</div>
                                    <div>
                                        <h3 className="font-semibold text-[#1A2A3A]">Pencarian Chord</h3>
                                        <p className="text-sm text-gray-600">
                                            Cari chord lagu favorit Anda berdasarkan judul, artis, atau genre.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                <div className="flex items-start space-x-3">
                                    <div className="text-2xl">🎛️</div>
                                    <div>
                                        <h3 className="font-semibold text-[#1A2A3A]">Chord Controls</h3>
                                        <p className="text-sm text-gray-600">
                                            Transpose chord, atur auto-scroll, dan ubah ukuran font sesuai kebutuhan.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                <div className="flex items-start space-x-3">
                                    <div className="text-2xl">📊</div>
                                    <div>
                                        <h3 className="font-semibold text-[#1A2A3A]">Diagram Chord</h3>
                                        <p className="text-sm text-gray-600">
                                            Lihat diagram posisi jari untuk setiap chord gitar yang ditampilkan.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                <div className="flex items-start space-x-3">
                                    <div className="text-2xl">🥁</div>
                                    <div>
                                        <h3 className="font-semibold text-[#1A2A3A]">Metronom</h3>
                                        <p className="text-sm text-gray-600">
                                            Gunakan metronom untuk berlatih dengan tempo yang tepat.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                <div className="flex items-start space-x-3">
                                    <div className="text-2xl">🎧</div>
                                    <div>
                                        <h3 className="font-semibold text-[#1A2A3A]">Player Spotify</h3>
                                        <p className="text-sm text-gray-600">
                                            Dengarkan lagu asli sambil belajar chord (jika tersedia di Spotify).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ); case 'complete':
                const preferencesWereSaved = (window as any).preferencesWereSaved !== false;
                return (
                    <div className="text-center space-y-6">
                        <div className="text-6xl mb-4">{steps[currentStep].icon}</div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#1A2A3A] mb-2">
                                Selamat! Anda Siap Mulai
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Profil Anda sudah lengkap dan Anda siap menjelajahi ribuan chord lagu
                                di Chording. Mari mulai perjalanan musik Anda!
                            </p>

                            {!preferencesWereSaved && (
                                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-4">
                                    <p className="text-sm text-yellow-700">
                                        <strong>Catatan:</strong> Preferensi musik Anda belum tersimpan karena masalah teknis.
                                        Anda dapat mengatur preferensi nanti di halaman pengaturan.
                                    </p>
                                </div>
                            )}

                            <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-[#1A2A3A] mb-2">Langkah selanjutnya:</h3>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>🎵 Cari chord lagu favorit Anda</li>
                                    <li>📚 Jelajahi genre musik yang Anda sukai</li>
                                    <li>⭐ Tandai chord favorit untuk akses cepat</li>
                                    <li>🎸 Berlatih dengan metronom dan diagram chord</li>
                                    {!preferencesWereSaved && (
                                        <li>⚙️ Atur preferensi musik di halaman pengaturan</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    }; return (
        <div className="fixed inset-0 bg-[#E0E8EF] bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden border-t-4 border-[#00FFFF]">
                {/* Header */}
                <div className="bg-[#1A2A3A] text-white p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold">Setup Akun</h1>
                        <div className="text-sm bg-[#00FFFF] text-[#1A2A3A] px-3 py-1 rounded-full">
                            {currentStep + 1} / {steps.length}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#2A3A4A] rounded-full h-2">
                        <div
                            className="bg-[#00FFFF] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>

                    <div className="mt-2">
                        <h2 className="font-semibold">{steps[currentStep].title}</h2>
                        <p className="text-gray-300 text-sm">{steps[currentStep].subtitle}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {renderStepContent()}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="flex justify-between">
                        <button
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                            className="px-4 py-2 text-[#1A2A3A] border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Sebelumnya
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={isLoading}
                            className="px-6 py-2 bg-[#00FFFF] text-[#1A2A3A] rounded-lg hover:bg-[#B0A0D0] disabled:opacity-50 font-medium transition-colors"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Menyimpan...
                                </div>
                            ) : currentStep === steps.length - 1 ? (
                                'Mulai Menggunakan Chording!'
                            ) : (
                                'Selanjutnya'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingFlow;
