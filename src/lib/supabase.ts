import { createClient } from '@supabase/supabase-js';
import { Song, UserProfile } from '@/types/database';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to create a new Supabase client (for server-side usage)
export const createSupabaseClient = () => {
    return createClient(supabaseUrl, supabaseAnonKey);
};

// Authentication API
export const authAPI = {
    // Sign in with email and password
    signIn: async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({
            email,
            password,
        });
    },

    // Sign up with email and password
    signUp: async (email: string, password: string, fullName?: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName || '',
                }
            }
        });

        if (error) return { data, error };

        // Create profile after successful signup
        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: data.user.id,
                        email: email,
                        full_name: fullName || '',
                        role: 'user', // Default role
                        onboarding_completed: false,
                    }
                ]);

            if (profileError) {
                console.error('Error creating profile:', profileError);
            }
        }

        return { data, error };
    },

    // Sign out
    signOut: async () => {
        return await supabase.auth.signOut();
    },

    // Reset password
    resetPassword: async (email: string) => {
        return await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password/confirm`,
        });
    },

    // Update password
    updatePassword: async (password: string) => {
        return await supabase.auth.updateUser({
            password: password
        });
    },

    // Get current user
    getCurrentUser: async () => {
        return await supabase.auth.getUser();
    },

    // Get user profile
    getUserProfile: async (userId: string): Promise<{ data: UserProfile | null; error: any }> => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        return { data, error };
    },

    // Update user profile
    updateUserProfile: async (userId: string, updates: Partial<UserProfile>) => {
        return await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId);
    },

    // Check onboarding status
    checkOnboardingStatus: async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error checking onboarding status:', error);
            return { onboarding_completed: false };
        }

        return { onboarding_completed: data?.onboarding_completed || false };
    },

    // Complete onboarding
    completeOnboarding: async (userId: string, profileData: Partial<UserProfile>) => {
        return await supabase
            .from('profiles')
            .update({
                ...profileData,
                onboarding_completed: true,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
    },

    // Check if user is admin
    isAdmin: async (userId: string): Promise<boolean> => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error checking admin status:', error);
                return false;
            }

            return data?.role === 'admin';
        } catch (error) {
            console.error('Error checking admin status:', error);
            return false;
        }
    },
};

// Song API
export const songAPI = {
    // Get all songs with pagination
    getAllSongs: async (page = 0, limit = 20) => {
        const offset = page * limit;

        return await supabase
            .from('songs')
            .select('*')
            .range(offset, offset + limit - 1)
            .order('created_at', { ascending: false });
    },

    // Get song by ID
    getSongById: async (id: string) => {
        return await supabase
            .from('songs')
            .select('*')
            .eq('id', id)
            .single();
    },

    // Search songs
    searchSongs: async (query: string) => {
        return await supabase
            .from('songs')
            .select('*')
            .or(`title.ilike.%${query}%,artist.ilike.%${query}%,genre.ilike.%${query}%`)
            .order('popularity', { ascending: false });
    },

    // Get songs by genre
    getSongsByGenre: async (genre: string) => {
        return await supabase
            .from('songs')
            .select('*')
            .eq('genre', genre)
            .order('popularity', { ascending: false });
    },

    // Get songs by artist
    getSongsByArtist: async (artist: string) => {
        return await supabase
            .from('songs')
            .select('*')
            .eq('artist', artist)
            .order('created_at', { ascending: false });
    },

    // Get popular songs
    getPopularSongs: async (limit = 20) => {
        return await supabase
            .from('songs')
            .select('*')
            .order('popularity', { ascending: false })
            .limit(limit);
    },

    // Get featured songs (same as popular for now)
    getFeaturedSongs: async (limit = 10) => {
        return await supabase
            .from('songs')
            .select('*')
            .order('popularity', { ascending: false })
            .limit(limit);
    },

    // Get all genres
    getGenres: async () => {
        return await supabase
            .from('songs')
            .select('genre')
            .not('genre', 'is', null);
    },

    // Get genres with count
    getGenresWithCount: async () => {
        const { data, error } = await supabase
            .from('songs')
            .select('genre')
            .not('genre', 'is', null);

        if (error) return { data: [], error };

        // Count occurrences of each genre
        const genreCounts: { [key: string]: number } = {};
        data?.forEach(song => {
            if (song.genre) {
                genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 1;
            }
        });

        const genresWithCount = Object.entries(genreCounts).map(([genre, count]) => ({
            genre,
            count
        }));

        return { data: genresWithCount, error: null };
    },

    // Get all artists
    getArtists: async () => {
        return await supabase
            .from('songs')
            .select('artist')
            .not('artist', 'is', null);
    },

    // Get all artists with song count
    getAllArtists: async () => {
        const { data, error } = await supabase
            .from('songs')
            .select('artist')
            .not('artist', 'is', null);

        if (error) return { data: [], error };

        // Count occurrences of each artist
        const artistCounts: { [key: string]: number } = {};
        data?.forEach(song => {
            if (song.artist) {
                artistCounts[song.artist] = (artistCounts[song.artist] || 0) + 1;
            }
        });

        const artistsWithCount = Object.entries(artistCounts).map(([artist, count]) => ({
            name: artist,
            songCount: count
        }));

        // Sort by song count descending, then by name
        artistsWithCount.sort((a, b) => {
            if (b.songCount !== a.songCount) {
                return b.songCount - a.songCount;
            }
            return a.name.localeCompare(b.name);
        });

        return { data: artistsWithCount, error: null };
    },

    // Add new song (admin only)
    addSong: async (songData: Omit<Song, 'id' | 'created_at' | 'updated_at'>) => {
        return await supabase
            .from('songs')
            .insert([{
                ...songData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }])
            .select()
            .single();
    },

    // Update song (admin only)
    updateSong: async (id: string, updates: Partial<Song>) => {
        return await supabase
            .from('songs')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();
    },

    // Delete song (admin only)
    deleteSong: async (id: string) => {
        return await supabase
            .from('songs')
            .delete()
            .eq('id', id);
    },

    // Increment song popularity
    incrementPopularity: async (id: string) => {
        return await supabase.rpc('increment_song_popularity', { song_id: id });
    },

    // Get website statistics
    getWebsiteStats: async () => {
        try {
            const [
                { count: totalSongs },
                { data: genresData, error: genresError },
                { data: artistsData, error: artistsError },
                { count: totalUsers }
            ] = await Promise.all([
                supabase.from('songs').select('*', { count: 'exact', head: true }),
                supabase.from('songs').select('genre').not('genre', 'is', null),
                supabase.from('songs').select('artist').not('artist', 'is', null),
                supabase.from('profiles').select('*', { count: 'exact', head: true })
            ]);

            // Count unique genres
            const uniqueGenres = genresData ? [...new Set(genresData.map(item => item.genre))].length : 0;

            // Count unique artists
            const uniqueArtists = artistsData ? [...new Set(artistsData.map(item => item.artist))].length : 0;

            return {
                data: {
                    totalSongs: totalSongs || 0,
                    totalGenres: uniqueGenres,
                    totalArtists: uniqueArtists,
                    totalUsers: totalUsers || 0,
                },
                error: null
            };
        } catch (error) {
            console.error('Error fetching website stats:', error);
            return {
                data: {
                    totalSongs: 0,
                    totalGenres: 0,
                    totalArtists: 0,
                    totalUsers: 0,
                },
                error
            };
        }
    },
};

// Admin API
export const adminAPI = {
    // Promote user to admin
    promoteToAdmin: async (userId: string) => {
        return await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', userId);
    },

    // Demote admin to user
    demoteToUser: async (userId: string) => {
        return await supabase
            .from('profiles')
            .update({ role: 'user' })
            .eq('id', userId);
    },

    // Get all users (admin only)
    getAllUsers: async () => {
        return await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
    },

    // Get admin statistics
    getAdminStats: async () => {
        const [
            { count: totalSongs },
            { count: totalUsers },
            { count: totalAdmins }
        ] = await Promise.all([
            supabase.from('songs').select('*', { count: 'exact', head: true }),
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin')
        ]);

        return {
            totalSongs: totalSongs || 0,
            totalUsers: totalUsers || 0,
            totalAdmins: totalAdmins || 0,
        };
    },

    // Get website statistics
    getWebsiteStats: async () => {
        return await songAPI.getWebsiteStats();
    },
};

// Export default client
export default supabase;
