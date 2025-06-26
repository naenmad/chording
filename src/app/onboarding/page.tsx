'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/supabase';
import OnboardingFlow from '@/components/OnboardingFlow';
import { User } from '@supabase/supabase-js';

const OnboardingPage = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [preferencesTestResult, setPreferencesTestResult] = useState<any>(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { user, error } = await authAPI.getCurrentUser();

                if (error || !user) {
                    // No user found, redirect to login
                    router.push('/login');
                    return;
                }

                setUser(user);

                // Test user preferences table access
                console.log('Testing user preferences table access...');
                const testResult = await authAPI.testUserPreferencesAccess(user.id);
                setPreferencesTestResult(testResult);
                console.log('Preferences test result:', testResult);

            } catch (error) {
                console.error('Error checking user:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, [router]);

    const handleOnboardingComplete = () => {
        // Check if preferences were successfully created
        if (preferencesTestResult && !preferencesTestResult.canWrite) {
            // Show a message about preferences not being saved
            alert('Onboarding selesai! Namun, preferensi Anda belum tersimpan karena masalah database. Anda dapat mengatur preferensi nanti di halaman pengaturan.');
        }

        // Redirect to home page after onboarding completion
        router.push('/');
        router.refresh();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#E0E8EF] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FFFF] mx-auto mb-4"></div>
                    <p className="text-[#1A2A3A]">Memuat...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to login
    } return (
        <div className="min-h-screen bg-[#E0E8EF]">
            {/* Show diagnostic info if there are database issues */}
            {preferencesTestResult && !preferencesTestResult.canWrite && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                <strong>Peringatan Database:</strong> Ada masalah dengan penyimpanan preferensi user.
                                Onboarding akan tetap berjalan, tapi preferensi mungkin tidak tersimpan.
                            </p>
                            {preferencesTestResult.errors.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-xs text-yellow-600">Detail error:</p>
                                    <ul className="text-xs text-yellow-600 list-disc list-inside">
                                        {preferencesTestResult.errors.map((error: string, index: number) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <OnboardingFlow user={user} onComplete={handleOnboardingComplete} />
        </div>
    );
};

export default OnboardingPage;
