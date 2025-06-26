'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { songAPI } from '@/lib/supabase';

// Types
type Song = {
    id: string;
    slug?: string;
    title: string;
    artist_name: string;
    difficulty: string;
    genre_name: string;
    view_count: number;
};

interface ArtistDetailPageProps {
    params: {
        name: string;
    };
}

export default function ArtistDetailPage({ params }: ArtistDetailPageProps) {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Convert URL slug back to artist name
    const artistName = decodeURIComponent(params.name).replace(/-/g, ' ');
    const formattedArtistName = artistName.replace(/\b\w/g, l => l.toUpperCase());

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                setLoading(true);
                const { data, error } = await songAPI.getSongsByArtist(formattedArtistName, 50);

                if (error) {
                    setError('Gagal memuat lagu');
                    return;
                }

                setSongs(data || []);
            } catch (err) {
                setError('Terjadi kesalahan');
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, [formattedArtistName]);

    return (
        <div className="bg-[#E0E8EF] min-h-screen">
            {/* Header Section */}
            <section className="bg-[#1A2A3A] text-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
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
                                <li>
                                    <Link href="/artists" className="text-gray-300 hover:text-[#00FFFF] transition-colors">
                                        Artis
                                    </Link>
                                </li>
                                <li className="text-gray-400">/</li>
                                <li className="text-[#00FFFF]">{formattedArtistName}</li>
                            </ol>
                        </nav>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1">
                            {/* Artist Avatar */}
                            <div className="bg-[#2A3A4A] rounded-lg p-8 text-center">
                                <div className="w-32 h-32 bg-[#00FFFF] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl text-[#1A2A3A] font-bold">
                                        {formattedArtistName.charAt(0)}
                                    </span>
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-2">{formattedArtistName}</h1>
                                <p className="text-gray-300 text-sm">
                                    {songs.length} lagu tersedia
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <h1 className="text-4xl font-bold mb-4">
                                Lagu dari {formattedArtistName}
                                <span className="text-[#00FFFF]">.</span>
                            </h1>
                            <p className="text-xl text-gray-300 max-w-3xl">
                                Kumpulan chord lagu terbaik dari {formattedArtistName}.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Songs List */}
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 9 }).map((_, index) => (
                                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                                    <div className="p-6 border-t-4 border-[#00FFFF]">
                                        <div className="animate-pulse">
                                            <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-[#1A2A3A] mb-4">Terjadi Kesalahan</h2>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <Link
                                href="/artists"
                                className="inline-block px-6 py-3 bg-[#00FFFF] text-[#1A2A3A] rounded-md hover:bg-[#B0A0D0] transition-colors"
                            >
                                Kembali ke Artis
                            </Link>
                        </div>
                    ) : songs.length > 0 ? (
                        <>
                            <div className="mb-6">
                                <p className="text-gray-600">
                                    Ditemukan <span className="font-semibold text-[#1A2A3A]">{songs.length}</span> lagu
                                    dari <span className="font-semibold text-[#1A2A3A]">{formattedArtistName}</span>
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {songs.map((song) => (
                                    <Link
                                        href={`/chord/${song.slug || song.id}`}
                                        key={song.id}
                                        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                                    >
                                        <div className="p-6 border-t-4 border-[#00FFFF]">
                                            <h3 className="text-xl font-semibold text-[#1A2A3A] mb-2">{song.title}</h3>
                                            <p className="text-gray-600 mb-3">{song.artist_name}</p>
                                            <div className="flex justify-between items-center">
                                                <div className="flex space-x-2">
                                                    <span className="inline-block bg-[#E0E8EF] text-[#1A2A3A] text-sm px-3 py-1 rounded-full">
                                                        {song.difficulty}
                                                    </span>
                                                    {song.genre_name && (
                                                        <span className="inline-block bg-[#B0A0D0] bg-opacity-30 text-[#1A2A3A] text-sm px-3 py-1 rounded-full">
                                                            {song.genre_name}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500 flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                    </svg>
                                                    {song.view_count?.toLocaleString() || '0'}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-[#1A2A3A] mb-4">Belum Ada Lagu</h2>
                            <p className="text-gray-600 mb-6">
                                Belum ada lagu yang tersedia dari {formattedArtistName}. Silakan coba artis lain.
                            </p>
                            <Link
                                href="/artists"
                                className="inline-block px-6 py-3 bg-[#00FFFF] text-[#1A2A3A] rounded-md hover:bg-[#B0A0D0] transition-colors"
                            >
                                Lihat Artis Lain
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
