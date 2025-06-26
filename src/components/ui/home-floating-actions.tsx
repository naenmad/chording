'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

const HomeFloatingActions = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };

        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading || !user) {
        return null; // Don't show anything if not authenticated
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Add Chord Button */}
            <Link
                href="/add-chord"
                className="group flex items-center bg-gradient-to-r from-[#00FFFF] to-[#B0A0D0] hover:from-[#B0A0D0] hover:to-[#00FFFF] text-[#1A2A3A] font-semibold px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20"
            >
                <svg
                    className="w-6 h-6 mr-2 group-hover:rotate-90 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Tambah Chord</span>
                <span className="sm:hidden">Tambah</span>
            </Link>
        </div>
    );
};

export default HomeFloatingActions;
