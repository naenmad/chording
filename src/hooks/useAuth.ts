'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    needsOnboarding: boolean;
}

export const useAuth = (requireAuth: boolean = false): UseAuthReturn => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { user, error } = await authAPI.getCurrentUser();

                if (error || !user) {
                    if (requireAuth) {
                        router.push('/login');
                        return;
                    }
                    setUser(null);
                    setLoading(false);
                    return;
                }

                setUser(user);                // Check onboarding status
                try {
                    const { onboarding_completed, error: onboardingError } = await authAPI.checkOnboardingStatus(user.id);

                    if (onboardingError) {
                        console.error('Error checking onboarding status:', onboardingError);
                        // Continue with default behavior even if onboarding check fails
                        setNeedsOnboarding(false);
                    } else {
                        if (!onboarding_completed) {
                            setNeedsOnboarding(true);
                            if (requireAuth) {
                                router.push('/onboarding');
                                return;
                            }
                        } else {
                            setNeedsOnboarding(false);
                        }
                    }
                } catch (onboardingError) {
                    console.error('Error in onboarding status check:', onboardingError);
                    // Default to not needing onboarding if check fails
                    setNeedsOnboarding(false);
                }

            } catch (error) {
                console.error('Error in auth check:', error);
                if (requireAuth) {
                    router.push('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [requireAuth, router]);

    return { user, loading, needsOnboarding };
};

export const useRequireAuth = (): UseAuthReturn => {
    return useAuth(true);
};
