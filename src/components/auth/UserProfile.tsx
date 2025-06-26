'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface UserProfileProps {
    user: User;
    onSignOut: () => void;
}

export const UserProfile = ({ user, onSignOut }: UserProfileProps) => {
    const [loading, setLoading] = useState(false);

    const handleSignOut = async () => {
        setLoading(true);
        try {
            await supabase.auth.signOut();
            onSignOut();
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAvatarUrl = () => {
        // Try to get avatar from user metadata (OAuth providers)
        if (user.user_metadata?.avatar_url) {
            return user.user_metadata.avatar_url;
        }

        // Fallback to gravatar or default
        const email = user.email || '';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || email)}&size=40&background=00FFFF&color=1A2A3A`;
    };

    const getDisplayName = () => {
        return user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'User';
    };

    const getProviderInfo = () => {
        // Get OAuth provider info
        const providers = user.app_metadata?.providers || [];
        const provider = user.app_metadata?.provider;

        if (provider === 'google') {
            return { name: 'Google', icon: '🔍', color: '#db4437' };
        } else if (provider === 'facebook') {
            return { name: 'Facebook', icon: '📘', color: '#4267B2' };
        } else {
            return { name: 'Email', icon: '📧', color: '#00FFFF' };
        }
    };

    const providerInfo = getProviderInfo();

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 border-t-4 border-[#00FFFF]">
            <div className="flex items-center space-x-3">
                {/* Avatar */}
                <img
                    src={getAvatarUrl()}
                    alt={getDisplayName()}
                    className="w-12 h-12 rounded-full border-2 border-[#00FFFF]"
                />

                {/* User Info */}
                <div className="flex-1">
                    <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-[#1A2A3A]">
                            {getDisplayName()}
                        </h3>
                        <span
                            className="text-xs px-2 py-1 rounded-full text-white"
                            style={{ backgroundColor: providerInfo.color }}
                        >
                            {providerInfo.icon} {providerInfo.name}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">
                        Bergabung: {new Date(user.created_at).toLocaleDateString('id-ID')}
                    </p>
                </div>

                {/* Sign Out Button */}
                <button
                    onClick={handleSignOut}
                    disabled={loading}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 text-sm"
                >
                    {loading ? '...' : 'Keluar'}
                </button>
            </div>

            {/* Additional OAuth Info */}
            {user.user_metadata && Object.keys(user.user_metadata).length > 0 && (
                <details className="mt-3">
                    <summary className="text-xs text-gray-500 cursor-pointer hover:text-[#00FFFF]">
                        Informasi Profil
                    </summary>
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs space-y-1">
                        {user.user_metadata.full_name && (
                            <div><strong>Nama:</strong> {user.user_metadata.full_name}</div>
                        )}
                        {user.user_metadata.picture && (
                            <div><strong>Foto Profil:</strong> Ada</div>
                        )}
                        {user.app_metadata?.provider && (
                            <div><strong>Login via:</strong> {user.app_metadata.provider}</div>
                        )}
                        <div><strong>Email Verified:</strong> {user.email_confirmed_at ? 'Ya' : 'Tidak'}</div>
                    </div>
                </details>
            )}
        </div>
    );
};

// Hook untuk menggunakan auth state
export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setLoading(false);
        };

        getInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth event:', event, session?.user?.email);
            setUser(session?.user || null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    return { user, loading };
};
