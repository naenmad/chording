'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/database';

interface UseAuthReturn {
    user: User | null;
    profile: UserProfile | null;
    isAdmin: boolean;
    loading: boolean;
    needsOnboarding: boolean;
    refreshProfile: () => Promise<void>;
}

export const useAuth = (requireAuth: boolean = false): UseAuthReturn => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);
    const router = useRouter();

    const refreshProfile = async () => {
        if (!user) return;

        try {
            const { data: profileData, error } = await authAPI.getUserProfile(user.id);
            if (!error && profileData) {
                setProfile(profileData);
                setIsAdmin(profileData.role === 'admin');
            }
        } catch (error) {
            console.error('Error refreshing profile:', error);
        }
    };

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
                    setProfile(null);
                    setIsAdmin(false);
                    setLoading(false);
                    return;
                }

                setUser(user);

                // Get user profile with role
                const { data: profileData, error: profileError } = await authAPI.getUserProfile(user.id);
                if (!profileError && profileData) {
                    setProfile(profileData);
                    setIsAdmin(profileData.role === 'admin');
                } else {
                    console.error('Error fetching profile:', profileError);
                }

                // Check onboarding status
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

    return { user, profile, isAdmin, loading, needsOnboarding, refreshProfile };
};

export const useRequireAuth = (): UseAuthReturn => {
    return useAuth(true);
};

// Hook specifically for checking admin access
export const useAdminAuth = () => {
    const auth = useAuth();

    return {
        ...auth,
        hasAdminAccess: auth.isAdmin && !auth.loading,
        requireAdmin: () => {
            if (auth.loading) return false;
            if (!auth.user) {
                throw new Error('User not authenticated');
            }
            if (!auth.isAdmin) {
                throw new Error('Admin access required');
            }
            return true;
        }
    };
};
