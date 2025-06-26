'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { songAPI } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { highlightChords } from '@/components/utils/chord-highlighter';

export default function AddChordPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [genres, setGenres] = useState<string[]>([]);
    const [existingArtists, setExistingArtists] = useState<string[]>([]);
    const [showArtistSuggestions, setShowArtistSuggestions] = useState(false);
    const router = useRouter();

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        artist_name: '',
        genre_name: '',
        difficulty: 'Easy',
        key_signature: '',
        capo: 'No Capo',
        tempo: '',
        duration: '',
        lyrics: '',
        spotify_url: ''
    });

    // Preview state
    const [showPreview, setShowPreview] = useState(false);

    // Check authentication status
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/login?redirect=/add-chord');
                    return;
                }
                setUser(user);

                // Fetch existing genres
                const genresResponse = await songAPI.getGenresWithCount();
                if (genresResponse?.data) {
                    const genreNames = genresResponse.data.map((g: any) => g.name);
                    setGenres(genreNames);
                }

                // Fetch existing artists for autocomplete
                const artistsResponse = await songAPI.getAllArtists();
                if (artistsResponse?.data) {
                    const artistNames = artistsResponse.data.map((a: any) => a.name);
                    setExistingArtists(artistNames);
                }
            } catch (error) {
                console.error('Auth error:', error);
                router.push('/login?redirect=/add-chord');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Show artist suggestions when typing in artist field
        if (name === 'artist_name') {
            setShowArtistSuggestions(value.length > 0);
        }
    };

    // Handle artist suggestion selection
    const handleArtistSuggestion = (artistName: string) => {
        const currentArtists = formData.artist_name.split(',').map(a => a.trim()).filter(a => a.length > 0);
        const lastArtist = currentArtists[currentArtists.length - 1] || '';

        // If there's a partial artist being typed, replace it
        if (lastArtist && !existingArtists.includes(lastArtist)) {
            currentArtists[currentArtists.length - 1] = artistName;
        } else {
            currentArtists.push(artistName);
        }

        setFormData(prev => ({
            ...prev,
            artist_name: currentArtists.join(', ')
        }));
        setShowArtistSuggestions(false);
    };

    // Filter artist suggestions based on input
    const getFilteredArtistSuggestions = () => {
        if (!formData.artist_name) return [];

        const currentArtists = formData.artist_name.split(',').map(a => a.trim()).filter(a => a.length > 0);
        const lastArtist = currentArtists[currentArtists.length - 1] || '';

        return existingArtists.filter(artist =>
            artist.toLowerCase().includes(lastArtist.toLowerCase()) &&
            !currentArtists.includes(artist)
        ).slice(0, 5); // Limit to 5 suggestions
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert('Anda harus login terlebih dahulu!');
            return;
        }

        setSubmitting(true);

        try {
            // Validate required fields
            if (!formData.title || !formData.artist_name || !formData.lyrics || !formData.spotify_url) {
                alert('Judul, Artis, Lirik, dan Link Spotify wajib diisi!');
                setSubmitting(false);
                return;
            }

            // Validate Spotify URL format and extract ID
            if (!formData.spotify_url.includes('open.spotify.com')) {
                alert('Format link Spotify tidak valid. Gunakan link dari open.spotify.com');
                setSubmitting(false);
                return;
            }

            // Extract Spotify track ID from URL
            const extractSpotifyId = (url: string): string | null => {
                // Handle different Spotify URL formats:
                // https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC
                // https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC?si=...
                const trackMatch = url.match(/\/track\/([a-zA-Z0-9]+)/);
                return trackMatch ? trackMatch[1] : null;
            };

            const spotifyId = extractSpotifyId(formData.spotify_url);
            if (!spotifyId) {
                alert('Tidak dapat mengextract ID dari link Spotify. Pastikan link valid.');
                setSubmitting(false);
                return;
            }

            // Process multiple artists
            const processedArtistName = formData.artist_name
                .split(',')
                .map(artist => artist.trim())
                .filter(artist => artist.length > 0)
                .join(', ');

            // Validate that we have at least one valid artist after processing
            if (!processedArtistName) {
                alert('Nama artis tidak valid. Pastikan Anda memasukkan minimal satu nama artis.');
                setSubmitting(false);
                return;
            }

            // Insert new song to database
            const { data, error } = await supabase
                .from('songs')
                .insert([{
                    ...formData,
                    artist_name: processedArtistName, // Use processed artist name
                    spotify_url: spotifyId, // Store only Spotify ID, not full URL
                    view_count: 0,
                    // Note: is_featured and is_popular are determined automatically by the system:
                    // - is_featured: based on view count and recent activity (last 30 days)
                    // - is_popular: based on view count threshold (minimum 10 views)
                    // This prevents users from manually marking their own songs as featured/popular
                    is_featured: false, // Default to false, can be set by admin later
                    is_popular: false, // Will be determined by algorithm based on views/engagement
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select('id, slug')
                .single();

            if (error) {
                console.error('Error adding song:', error);

                // If slug column doesn't exist yet, try without selecting slug
                if (error.message?.includes('slug') || error.code === '42703') {
                    const { data: fallbackData, error: fallbackError } = await supabase
                        .from('songs')
                        .insert([{
                            ...formData,
                            artist_name: processedArtistName,
                            spotify_url: spotifyId,
                            view_count: 0,
                            // Automatic determination for featured/popular status
                            is_featured: false,
                            is_popular: false,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }])
                        .select('id')
                        .single();

                    if (fallbackError) {
                        alert('Gagal menambahkan chord. Silakan coba lagi.');
                        setSubmitting(false);
                        return;
                    }

                    alert('Chord berhasil ditambahkan!');
                    router.push(`/chord/${fallbackData.id}`);
                    return;
                }

                alert('Gagal menambahkan chord. Silakan coba lagi.');
                setSubmitting(false);
                return;
            }

            alert('Chord berhasil ditambahkan!');
            // Redirect using slug for SEO-friendly URL
            router.push(`/chord/${data.slug || data.id}`);
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-[#E0E8EF] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00FFFF] mx-auto"></div>
                    <p className="mt-4 text-[#1A2A3A]">Memuat...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to login
    }

    return (
        <div className="bg-[#E0E8EF] min-h-screen">
            {/* Header Section */}
            <section className="bg-[#1A2A3A] text-white py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="flex items-center space-x-2 text-sm">
                                <li>
                                    <Link href="/" className="text-gray-300 hover:text-[#00FFFF] transition-colors">
                                        Beranda
                                    </Link>
                                </li>
                                <li className="text-gray-400">/</li>
                                <li className="text-[#00FFFF]">Tambah Chord</li>
                            </ol>
                        </nav>
                    </div>

                    <h1 className="text-4xl font-bold mb-4">
                        Tambah Chord Baru
                        <span className="text-[#00FFFF]">.</span>
                    </h1>
                    <p className="text-xl text-gray-300">
                        Bagikan chord lagu favorit Anda dengan komunitas musisi Indonesia.
                    </p>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-[#00FFFF]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Info */}
                            <div className="md:col-span-2">
                                <h2 className="text-2xl font-semibold text-[#1A2A3A] mb-6">Informasi Dasar</h2>
                            </div>

                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Judul Lagu *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A]"
                                    placeholder="Masukkan judul lagu"
                                />
                            </div>

                            <div>
                                <label htmlFor="artist_name" className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Nama Artis *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="artist_name"
                                        name="artist_name"
                                        value={formData.artist_name}
                                        onChange={handleInputChange}
                                        onFocus={() => setShowArtistSuggestions(formData.artist_name.length > 0)}
                                        onBlur={() => setTimeout(() => setShowArtistSuggestions(false), 200)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A]"
                                        placeholder="Contoh: Sheila on 7, Raisa, Tulus"
                                    />

                                    {/* Artist Suggestions Dropdown */}
                                    {showArtistSuggestions && getFilteredArtistSuggestions().length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                            {getFilteredArtistSuggestions().map((artist, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleArtistSuggestion(artist)}
                                                    className="w-full px-4 py-2 text-left text-[#1A2A3A] hover:bg-[#E0E8EF] focus:bg-[#E0E8EF] focus:outline-none transition-colors"
                                                >
                                                    <span className="font-medium">{artist}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    Untuk beberapa artis, pisahkan dengan koma. Mulai ketik untuk melihat saran artis yang sudah ada.
                                </p>
                                {formData.artist_name && formData.artist_name.includes(',') && (
                                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                                        <p className="text-sm text-blue-700 font-medium">Preview artis:</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {formData.artist_name.split(',').map((artist, index) => (
                                                <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                    {artist.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="genre_name" className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Genre
                                </label>
                                <select
                                    id="genre_name"
                                    name="genre_name"
                                    value={formData.genre_name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A]"
                                >
                                    <option value="">Pilih Genre</option>
                                    {/* Genres from database first */}
                                    {genres.map((genre) => (
                                        <option key={genre} value={genre}>{genre}</option>
                                    ))}
                                    {/* Common genres fallback (only show if not already in database) */}
                                    {['Pop', 'Rock', 'Ballad', 'Jazz', 'Folk', 'Acoustic', 'Dangdut', 'Alternative', 'Indie', 'R&B', 'Soul', 'Reggae', 'Ska', 'Punk', 'Metal', 'Hip Hop', 'Rap', 'Electronic', 'EDM', 'Classical', 'Country', 'Blues', 'Gospel', 'Spiritual', 'Keroncong', 'Campursari', 'Slow Rock', 'Love Song', 'Soundtrack', 'Instrumental', 'World Music', 'Latin', 'Bossa Nova', 'Fusion', 'Progressive', 'Experimental'].map((genre) => (
                                        !genres.includes(genre) && (
                                            <option key={genre} value={genre}>{genre}</option>
                                        )
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="difficulty" className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Tingkat Kesulitan
                                </label>
                                <select
                                    id="difficulty"
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A]"
                                >
                                    <option value="Easy">Mudah</option>
                                    <option value="Intermediate">Sedang</option>
                                    <option value="Advanced">Sulit</option>
                                </select>
                            </div>

                            {/* Musical Info */}
                            <div className="md:col-span-2 mt-8">
                                <h2 className="text-2xl font-semibold text-[#1A2A3A] mb-6">Informasi Musik</h2>
                            </div>

                            <div>
                                <label htmlFor="key_signature" className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Kunci Dasar
                                </label>
                                <select
                                    id="key_signature"
                                    name="key_signature"
                                    value={formData.key_signature}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A]"
                                >
                                    <option value="">Pilih Kunci Dasar</option>
                                    {/* Major Keys */}
                                    <option value="C">C Major</option>
                                    <option value="C#">C# Major</option>
                                    <option value="D">D Major</option>
                                    <option value="D#">D# Major</option>
                                    <option value="E">E Major</option>
                                    <option value="F">F Major</option>
                                    <option value="F#">F# Major</option>
                                    <option value="G">G Major</option>
                                    <option value="G#">G# Major</option>
                                    <option value="A">A Major</option>
                                    <option value="A#">A# Major</option>
                                    <option value="B">B Major</option>
                                    {/* Minor Keys */}
                                    <option value="Am">A Minor</option>
                                    <option value="A#m">A# Minor</option>
                                    <option value="Bm">B Minor</option>
                                    <option value="Cm">C Minor</option>
                                    <option value="C#m">C# Minor</option>
                                    <option value="Dm">D Minor</option>
                                    <option value="D#m">D# Minor</option>
                                    <option value="Em">E Minor</option>
                                    <option value="Fm">F Minor</option>
                                    <option value="F#m">F# Minor</option>
                                    <option value="Gm">G Minor</option>
                                    <option value="G#m">G# Minor</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="capo" className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Capo
                                </label>
                                <select
                                    id="capo"
                                    name="capo"
                                    value={formData.capo}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A]"
                                >
                                    <option value="No Capo">No Capo</option>
                                    <option value="Fret 1">Fret 1</option>
                                    <option value="Fret 2">Fret 2</option>
                                    <option value="Fret 3">Fret 3</option>
                                    <option value="Fret 4">Fret 4</option>
                                    <option value="Fret 5">Fret 5</option>
                                    <option value="Fret 6">Fret 6</option>
                                    <option value="Fret 7">Fret 7</option>
                                    <option value="Fret 8">Fret 8</option>
                                    <option value="Fret 9">Fret 9</option>
                                    <option value="Fret 10">Fret 10</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="tempo" className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Tempo
                                </label>
                                <input
                                    type="text"
                                    id="tempo"
                                    name="tempo"
                                    value={formData.tempo}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A]"
                                    placeholder="Contoh: 120 BPM"
                                />
                            </div>

                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Durasi
                                </label>
                                <input
                                    type="text"
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A]"
                                    placeholder="Contoh: 3:45"
                                />
                            </div>

                            {/* Links */}
                            <div className="md:col-span-2 mt-8">
                                <h2 className="text-2xl font-semibold text-[#1A2A3A] mb-6">Link Eksternal</h2>
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="spotify_url" className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Link Spotify *
                                </label>
                                <input
                                    type="url"
                                    id="spotify_url"
                                    name="spotify_url"
                                    value={formData.spotify_url}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A]"
                                    placeholder="https://open.spotify.com/track/..."
                                />
                                <p className="text-sm text-[#1A2A3A] mt-1">
                                    Wajib diisi. Salin link dari aplikasi Spotify (contoh: https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC).
                                    Sistem akan otomatis mengextract ID untuk efisiensi.
                                </p>
                            </div>

                            {/* Lyrics */}
                            <div className="md:col-span-2 mt-8">
                                <h2 className="text-2xl font-semibold text-[#1A2A3A] mb-6">Lirik dan Chord *</h2>

                                {/* Toggle Preview */}
                                <div className="mb-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowPreview(!showPreview)}
                                        className="px-4 py-2 text-sm bg-gray-100 text-[#1A2A3A] rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                        {showPreview ? 'Sembunyikan Preview' : 'Tampilkan Preview'}
                                    </button>
                                </div>

                                <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
                                    {/* Input Form */}
                                    <div>
                                        <label htmlFor="lyrics" className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                            Lirik dengan Chord
                                        </label>
                                        <textarea
                                            id="lyrics"
                                            name="lyrics"
                                            value={formData.lyrics}
                                            onChange={handleInputChange}
                                            required
                                            rows={showPreview ? 25 : 20}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent font-mono text-sm text-[#1A2A3A]"
                                            placeholder="Contoh:
[Intro]
C Am F G

[Verse 1]
C           Am
Ku ingin bersamamu
F           G
Hingga akhir waktu
C           Am
Berjalan bersamamu
F           G
Menuju masa depan

[Chorus]
F      G      C   Am
Kau adalah hidupku
F      G      C
Yang tak akan pernah pergi..."
                                        />
                                        <p className="text-sm text-[#1A2A3A] mt-2">
                                            Tips: Gunakan format [Intro], [Verse], [Chorus], [Bridge] untuk struktur lagu.
                                            Tulis chord di atas lirik yang sesuai.
                                        </p>
                                    </div>

                                    {/* Preview */}
                                    {showPreview && (
                                        <div>
                                            <label className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                                Preview Chord & Lirik
                                            </label>
                                            <div
                                                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white overflow-y-auto text-sm"
                                                style={{ height: showPreview ? '25rem' : '20rem' }}
                                            >
                                                {formData.lyrics ? (
                                                    <div
                                                        className="chord-content whitespace-pre-line font-mono leading-relaxed"
                                                        dangerouslySetInnerHTML={{
                                                            __html: highlightChords(formData.lyrics)
                                                        }}
                                                    />
                                                ) : (
                                                    <p className="text-gray-500 italic">
                                                        Mulai mengetik lirik dengan chord untuk melihat preview...
                                                    </p>
                                                )}
                                            </div>
                                            <p className="text-sm text-[#1A2A3A] mt-2">
                                                Preview ini menunjukkan bagaimana chord dan lirik akan ditampilkan.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex justify-end space-x-4">
                            <Link
                                href="/"
                                className="px-6 py-3 border border-gray-300 rounded-md text-[#1A2A3A] hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-3 bg-[#00FFFF] text-[#1A2A3A] rounded-md hover:bg-[#1A2A3A] hover:text-white transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Menyimpan...' : 'Simpan Chord'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}
