'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const OnboardingBanner = () => {
    const { user, needsOnboarding } = useAuth();

    if (!user || !needsOnboarding) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-[#00FFFF] to-[#B0A0D0] border-l-4 border-[#1A2A3A] p-4 mb-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-[#1A2A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-[#1A2A3A] font-semibold">
                            Selesaikan Setup Akun Anda
                        </p>
                        <p className="text-[#1A2A3A] text-sm">
                            Lengkapi profil dan preferensi untuk pengalaman yang lebih personal
                        </p>
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <Link
                        href="/onboarding"
                        className="bg-[#1A2A3A] text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                    >
                        Lanjutkan Setup
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OnboardingBanner;
