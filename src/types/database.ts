// Database types for the Chording app

export interface Song {
    id: string;
    title: string;
    artist: string;
    genre: string;
    lyrics: string;
    chords_data?: {
        chords?: Array<{
            name: string;
            fingering?: string;
            frets?: number[];
        }>;
    };
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    tempo?: number;
    key?: string;
    capo?: number;
    strumming_pattern?: string;
    popularity?: number;
    youtube_url?: string;
    spotify_url?: string;
    created_at?: string;
    updated_at?: string;
}

export interface UserProfile {
    id: string;
    email?: string;
    full_name?: string;
    role?: 'admin' | 'user';
    onboarding_completed?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Genre {
    name: string;
    description?: string;
    song_count?: number;
}

export interface Artist {
    name: string;
    bio?: string;
    song_count?: number;
}

export interface ChordDiagram {
    name: string;
    fingering?: string;
    frets?: number[];
}

export interface DatabaseResponse<T> {
    data: T | null;
    error: any;
}
