import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export createClient function for pages that need to create their own client
export const createSupabaseClient = () => createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const authAPI = {
    // Sign up with email and password
    signUp: async (email: string, password: string, fullName?: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                }
            }
        })
        return { data, error }
    },

    // Sign in with email and password
    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        return { data, error }
    },

    // Sign out
    signOut: async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
    },

    // Reset password
    resetPassword: async (email: string) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password/confirm`,
        })
        return { data, error }
    },

    // Update password (for reset password flow)
    updatePassword: async (newPassword: string) => {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        })
        return { data, error }
    },

    // Get current user
    getCurrentUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser()
        return { user, error }
    },

    // Sign in with OAuth (Google, Facebook, etc.)
    signInWithOAuth: async (provider: 'google' | 'facebook') => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        })
        return { data, error }
    },    // Check if user has completed onboarding
    checkOnboardingStatus: async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('onboarding_completed')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // User profile not found, create initial profile
                    console.log('Profile not found, creating initial profile');
                    const { error: createError } = await supabase
                        .from('profiles')
                        .insert({
                            id: userId,
                            onboarding_completed: false,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        });

                    if (createError) {
                        console.error('Error creating initial profile:', createError);
                    }

                    return { onboarding_completed: false, error: null };
                } else if (error.code === '42703') {
                    // Column doesn't exist, assume onboarding not completed
                    console.warn('onboarding_completed column not found in profiles table');
                    return { onboarding_completed: false, error: null };
                } else {
                    console.error('Error checking onboarding status:', error);
                    return { onboarding_completed: false, error };
                }
            }

            return {
                onboarding_completed: data?.onboarding_completed || false,
                error: null
            };
        } catch (error) {
            console.error('Error in checkOnboardingStatus:', error);
            return { onboarding_completed: false, error: null };
        }
    },

    // Create initial profile record
    createInitialProfile: async (userId: string, userData: any) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    full_name: userData.full_name || '',
                    email: userData.email || '',
                    onboarding_completed: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

            return { data, error };
        } catch (error) {
            console.error('Error creating initial profile:', error);
            return { data: null, error };
        }
    },    // Debug utility to test database connectivity and permissions
    debugDatabaseAccess: async (userId: string) => {
        const results: {
            canAccessProfiles: boolean;
            canAccessUserPreferences: boolean;
            profileExists: boolean;
            userPreferencesExist: boolean;
            currentUser: any;
            errors: string[];
        } = {
            canAccessProfiles: false,
            canAccessUserPreferences: false,
            profileExists: false,
            userPreferencesExist: false,
            currentUser: null,
            errors: []
        };

        try {
            // Test current user
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            results.currentUser = user;
            if (userError) results.errors.push(`User auth error: ${userError.message}`);

            // Test profiles table access
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('count', { count: 'exact', head: true });
                results.canAccessProfiles = !error;
                if (error) results.errors.push(`Profiles access error: ${error.message}`);
            } catch (e) {
                results.errors.push(`Profiles table error: ${e}`);
            }

            // Test user_preferences table access
            try {
                const { data, error } = await supabase
                    .from('user_preferences')
                    .select('count', { count: 'exact', head: true });
                results.canAccessUserPreferences = !error;
                if (error) results.errors.push(`User preferences access error: ${error.message}`);
            } catch (e) {
                results.errors.push(`User preferences table error: ${e}`);
            }

            // Check if user profile exists
            if (results.canAccessProfiles && userId) {
                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('id, onboarding_completed')
                        .eq('id', userId)
                        .single();
                    results.profileExists = !!data && !error;
                    if (error && error.code !== 'PGRST116') {
                        results.errors.push(`Profile check error: ${error.message}`);
                    }
                } catch (e) {
                    results.errors.push(`Profile existence check error: ${e}`);
                }
            }

            // Check if user preferences exist
            if (results.canAccessUserPreferences && userId) {
                try {
                    const { data, error } = await supabase
                        .from('user_preferences')
                        .select('id')
                        .eq('user_id', userId)
                        .single();
                    results.userPreferencesExist = !!data && !error;
                    if (error && error.code !== 'PGRST116') {
                        results.errors.push(`User preferences check error: ${error.message}`);
                    }
                } catch (e) {
                    results.errors.push(`User preferences existence check error: ${e}`);
                }
            }

        } catch (error) {
            results.errors.push(`General debug error: ${error}`);
        }

        return results;
    },

    // Create default user preferences
    createDefaultUserPreferences: async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('user_preferences')
                .upsert({
                    user_id: userId,
                    favorite_genre: '',
                    skill_level: 'beginner',
                    primary_instrument: 'guitar',
                    email_notifications: true,
                    practice_reminders: false,
                    new_features: true,
                    marketing_emails: false,
                    auto_scroll_speed: 'medium',
                    default_instrument: 'guitar',
                    chord_display: 'diagram',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id'
                })
                .select();

            return { data, error };
        } catch (error) {
            console.error('Error creating default user preferences:', error);
            return { data: null, error };
        }
    },    // Test user preferences table access
    testUserPreferencesAccess: async (userId: string) => {
        const results: {
            canRead: boolean;
            canWrite: boolean;
            tableExists: boolean;
            recordExists: boolean;
            errors: string[];
        } = {
            canRead: false,
            canWrite: false,
            tableExists: false,
            recordExists: false,
            errors: []
        };

        try {
            // Test if table exists and is accessible
            const { data: countData, error: countError } = await supabase
                .from('user_preferences')
                .select('count', { count: 'exact', head: true });

            if (countError) {
                results.errors.push(`Table access error: ${countError.message || 'Unknown error'}`);
                results.tableExists = false;
            } else {
                results.tableExists = true;
                results.canRead = true;
            }

            // Test if user record exists
            if (results.canRead) {
                const { data: existingData, error: existingError } = await supabase
                    .from('user_preferences')
                    .select('id')
                    .eq('user_id', userId)
                    .single();

                if (existingError && existingError.code !== 'PGRST116') {
                    results.errors.push(`Record check error: ${existingError.message}`);
                } else if (existingData) {
                    results.recordExists = true;
                }
            }

            // Test write access
            if (results.canRead) {
                const testData = {
                    user_id: userId,
                    skill_level: 'test',
                    updated_at: new Date().toISOString()
                };

                const { error: writeError } = await supabase
                    .from('user_preferences')
                    .upsert(testData, { onConflict: 'user_id' });

                if (writeError) {
                    results.errors.push(`Write test error: ${writeError.message || 'Unknown write error'}`);
                } else {
                    results.canWrite = true;
                }
            }

        } catch (error) {
            results.errors.push(`General test error: ${error}`);
        }

        return results;
    }
}

// Database API for fetching data
export const databaseAPI = {
    // Get all songs
    getAllSongs: async () => {
        const { data, error } = await supabase
            .from('songs')
            .select('*')
            .order('title', { ascending: true });

        return { data, error };
    },

    // Get song by ID
    getSongById: async (id: string) => {
        const { data, error } = await supabase
            .from('songs')
            .select('*')
            .eq('id', id)
            .single();

        return { data, error };
    },

    // Get songs by genre
    getSongsByGenre: async (genre: string) => {
        const { data, error } = await supabase
            .from('songs')
            .select('*')
            .eq('genre', genre)
            .order('title', { ascending: true });

        return { data, error };
    },

    // Get songs by artist
    getSongsByArtist: async (artist: string) => {
        const { data, error } = await supabase
            .from('songs')
            .select('*')
            .eq('artist', artist)
            .order('title', { ascending: true });

        return { data, error };
    },

    // Get popular songs
    getPopularSongs: async (limit: number = 20) => {
        const { data, error } = await supabase
            .from('songs')
            .select('*')
            .order('popularity', { ascending: false })
            .limit(limit);

        return { data, error };
    },

    // Get all genres
    getAllGenres: async () => {
        const { data, error } = await supabase
            .from('songs')
            .select('genre')
            .not('genre', 'is', null);

        if (error) return { data: [], error };

        // Get unique genres
        const uniqueGenres = [...new Set(data.map(song => song.genre))].filter(Boolean);
        return { data: uniqueGenres, error: null };
    },

    // Get all artists
    getAllArtists: async () => {
        const { data, error } = await supabase
            .from('songs')
            .select('artist')
            .not('artist', 'is', null);

        if (error) return { data: [], error };

        // Get unique artists
        const uniqueArtists = [...new Set(data.map(song => song.artist))].filter(Boolean);
        return { data: uniqueArtists, error: null };
    },

    // Search songs
    searchSongs: async (query: string) => {
        const { data, error } = await supabase
            .from('songs')
            .select('*')
            .or(`title.ilike.%${query}%,artist.ilike.%${query}%,genre.ilike.%${query}%`)
            .order('title', { ascending: true });

        return { data, error };
    },
};

// Song/Chord API functions
export const songAPI = {
    // Get featured songs for homepage
    getFeaturedSongs: async (limit: number = 4) => {
        const { data, error } = await supabase
            .from('songs')
            .select('id, slug, title, artist_name, difficulty, view_count')
            .eq('is_featured', true)
            .order('view_count', { ascending: false })
            .limit(limit);

        return { data, error };
    },

    // Get popular songs
    getPopularSongs: async (limit: number = 12) => {
        const { data, error } = await supabase
            .from('songs')
            .select('id, slug, title, artist_name, difficulty, genre_name, view_count')
            .eq('is_popular', true)
            .order('view_count', { ascending: false })
            .limit(limit);

        return { data, error };
    },

    // Get song by ID
    getSongById: async (id: string) => {
        const { data, error } = await supabase
            .from('songs')
            .select('*')
            .eq('id', id)
            .single();

        return { data, error };
    },

    // Get song by slug (SEO-friendly URL)
    getSongBySlug: async (slug: string) => {
        const { data, error } = await supabase
            .from('songs')
            .select('*')
            .eq('slug', slug)
            .single();

        return { data, error };
    },

    // Get genres with song count
    getGenresWithCount: async () => {
        const { data, error } = await supabase
            .from('songs')
            .select('genre_name')
            .not('genre_name', 'is', null);

        if (error) return { data: [], error };

        // Count songs per genre
        const genreCount = data.reduce((acc: any, song: any) => {
            const genre = song.genre_name;
            if (genre) {
                acc[genre] = (acc[genre] || 0) + 1;
            }
            return acc;
        }, {});

        // Convert to array format
        const genres = Object.entries(genreCount).map(([name, count]) => ({
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name,
            count
        }));

        return { data: genres, error: null };
    },

    // Get songs by genre
    getSongsByGenre: async (genreName: string, limit: number = 20) => {
        const { data, error } = await supabase
            .from('songs')
            .select('id, slug, title, artist_name, difficulty, view_count')
            .eq('genre_name', genreName)
            .order('view_count', { ascending: false })
            .limit(limit);

        return { data, error };
    },

    // Get songs by artist
    getSongsByArtist: async (artistName: string, limit: number = 20) => {
        const { data, error } = await supabase
            .from('songs')
            .select('id, slug, title, artist_name, difficulty, genre_name, view_count')
            .ilike('artist_name', `%${artistName}%`) // Use ilike to match artist in comma-separated list
            .order('view_count', { ascending: false })
            .limit(limit);

        if (error) return { data: [], error };

        // Filter results to only include songs where the artist name is actually present
        // (to avoid false matches like "John" matching "Johnson")
        const filteredData = data.filter((song: any) => {
            const artists = song.artist_name.split(',').map((a: string) => a.trim().toLowerCase());
            return artists.includes(artistName.toLowerCase());
        });

        return { data: filteredData, error: null };
    },

    // Search songs
    searchSongs: async (query: string, limit: number = 20) => {
        const { data, error } = await supabase
            .from('songs')
            .select('id, title, artist_name, difficulty, genre_name, view_count')
            .or(`title.ilike.%${query}%,artist_name.ilike.%${query}%`)
            .order('view_count', { ascending: false })
            .limit(limit);

        return { data, error };
    },

    // Increment view count
    incrementViewCount: async (songId: string) => {
        const { error } = await supabase.rpc('increment_song_view_count', {
            song_id: songId
        });

        return { error };
    },

    // Get all unique artists
    getAllArtists: async () => {
        const { data, error } = await supabase
            .from('songs')
            .select('artist_name')
            .not('artist_name', 'is', null);

        if (error) return { data: [], error };

        // Split multiple artists and count songs for each individual artist
        const artistCount: { [key: string]: number } = {};

        data.forEach((song: any) => {
            const artistName = song.artist_name;
            if (artistName) {
                // Split by comma and process each artist
                const artists = artistName.split(',').map((artist: string) => artist.trim());
                artists.forEach((artist: string) => {
                    if (artist) {
                        artistCount[artist] = (artistCount[artist] || 0) + 1;
                    }
                });
            }
        });

        // Convert to array format
        const artists = Object.entries(artistCount).map(([name, count]) => ({
            name,
            songCount: count as number
        }));

        return { data: artists.sort((a, b) => b.songCount - a.songCount), error: null };
    },

    // Add new song (requires authentication)
    addSong: async (songData: any) => {
        const { data, error } = await supabase
            .from('songs')
            .insert([{
                ...songData,
                view_count: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();

        return { data, error };
    },

    // Update song (requires authentication and ownership)
    updateSong: async (songId: string, songData: any) => {
        const { data, error } = await supabase
            .from('songs')
            .update({
                ...songData,
                updated_at: new Date().toISOString()
            })
            .eq('id', songId)
            .select()
            .single();

        return { data, error };
    },

    // Delete song (requires authentication and ownership)
    deleteSong: async (songId: string) => {
        const { error } = await supabase
            .from('songs')
            .delete()
            .eq('id', songId);

        return { error };
    }
};
