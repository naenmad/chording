'use client';

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ChordControls from "@/components/ui/chord-controls";
import ChordDiagram from "@/components/ui/chord-diagram";
import SpotifyPlayer from "@/components/ui/spotify-player";
import CopyButton from "@/components/ui/copy-button";
import ShareButton from "@/components/ui/share-button";
import { highlightChords } from '@/components/utils/chord-highlighter';
import { useEffect, useState, use } from 'react';
import { songAPI } from '@/lib/supabase';

interface ChordPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ChordPage({ params }: ChordPageProps) {
    const resolvedParams = use(params);
    const [chordData, setChordData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); useEffect(() => {
        const fetchChordData = async () => {
            try {
                setLoading(true);

                // Try to fetch by slug first (SEO-friendly URLs)
                let response = await songAPI.getSongBySlug(resolvedParams.id);
                let accessedViaId = false;

                // If slug fails, try as ID (for backward compatibility)
                if (response.error || !response.data) {
                    response = await songAPI.getSongById(resolvedParams.id);
                    accessedViaId = true;
                }

                if (response.error || !response.data) {
                    setError('Song not found');
                    return;
                }

                // If accessed via ID but has slug, redirect to slug URL for SEO
                if (accessedViaId && response.data.slug) {
                    redirect(`/chord/${response.data.slug}`);
                    return;
                }

                setChordData(response.data);

                // Increment view count using the actual ID
                await songAPI.incrementViewCount(response.data.id);
            } catch (err) {
                setError('Failed to load song data');
            } finally {
                setLoading(false);
            }
        };

        fetchChordData();
    }, [resolvedParams.id]);

    if (loading) {
        return (
            <div className="bg-[#E0E8EF] min-h-screen">
                <div className="max-w-4xl mx-auto p-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded mb-4"></div>
                        <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
                        <div className="h-6 bg-gray-300 rounded mb-4 w-1/2"></div>
                        <div className="bg-white rounded-lg p-6">
                            <div className="h-96 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !chordData) {
        return notFound();
    }

    // Related chords (placeholder - could be fetched from database)
    const relatedChords = [
        { id: "3", title: "Aku Milikmu", artist: "Iwan Fals", difficulty: "Advanced" },
        { id: "4", title: "Mencari Alasan", artist: "Exists", difficulty: "Intermediate" },
        { id: "5", title: "Separuh Aku", artist: "Noah", difficulty: "Easy" },
        { id: "6", title: "Dan", artist: "Sheila on 7", difficulty: "Intermediate" },
    ];

    const formattedLyrics = highlightChords(chordData.lyrics || '');

    // Extract BPM from tempo string (e.g., "120 BPM" -> 120)
    const extractBPM = (tempo: string): number => {
        const match = tempo?.match(/(\d+)/);
        return match ? parseInt(match[1]) : 120; // Default to 120 if no number found
    };

    const bpm = extractBPM(chordData.tempo || '120 BPM');

    // Simple chord diagrams for common chords
    const commonChordDiagrams: { [key: string]: string } = {
        "Am": "x02210",
        "F": "133211",
        "C": "x32010",
        "G": "320003",
        "D": "xx0232",
        "Em": "022000",
        "A": "x02220",
        "E": "022100",
        "Dm": "xx0231",
        "B": "x24442",
        "Bm": "x24432"
    };

    return (
        <div className="bg-[#E0E8EF] min-h-screen">
            {/* Header Section */}
            <section className="bg-[#1A2A3A] text-white py-12 px-4">
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
                                    <Link href="/popular" className="text-gray-300 hover:text-[#00FFFF] transition-colors">
                                        Chord
                                    </Link>
                                </li>
                                <li className="text-gray-400">/</li>
                                <li className="text-[#00FFFF]">{chordData.title}</li>
                            </ol>
                        </nav>
                    </div>

                    {/* Song Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                {chordData.title}
                                <span className="text-[#00FFFF]">.</span>
                            </h1>
                            <p className="text-2xl text-gray-300 mb-6">by {chordData.artist_name}</p>

                            {/* Stats */}
                            <div className="flex items-center space-x-6 text-gray-300">
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zM4.93 5.07a6.984 6.984 0 000 9.86 6.984 6.984 0 009.86 0 6.984 6.984 0 000-9.86 6.984 6.984 0 00-9.86 0z" clipRule="evenodd" />
                                    </svg>
                                    {chordData.view_count?.toLocaleString() || 0} views
                                </span>
                            </div>
                        </div>

                        {/* Song Details Card */}
                        <div className="bg-[#2A3A4A] p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-4 text-[#00FFFF]">Detail Lagu</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Genre:</span>
                                    <span className="text-white">{chordData.genre_name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Kunci:</span>
                                    <span className="text-[#00FFFF] font-semibold">{chordData.key_signature || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Capo:</span>
                                    <span className="text-white">{chordData.capo || 'No Capo'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Tempo:</span>
                                    <span className="text-white">{chordData.tempo || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Durasi:</span>
                                    <span className="text-white">{chordData.duration || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Kesulitan:</span>
                                    <span className={`px-2 py-1 rounded text-sm ${chordData.difficulty === 'Easy' ? 'bg-green-600' :
                                        chordData.difficulty === 'Intermediate' ? 'bg-yellow-600' :
                                            'bg-red-600'
                                        }`}>
                                        {chordData.difficulty || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex flex-wrap gap-3">
                            <CopyButton
                                text={chordData.chord_content || ''}
                                className="text-sm"
                            >
                                Salin Chord
                            </CopyButton>
                            <ShareButton
                                title={`${chordData.title} - ${chordData.artist_name}`}
                                text={`Chord ${chordData.title} by ${chordData.artist_name} di Chording!`}
                                className="text-sm"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Chord Content */}
                        <div className="lg:col-span-3">
                            {/* Chord Diagrams */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#00FFFF] mb-8">
                                <h3 className="text-xl font-semibold text-[#1A2A3A] mb-4">Diagram Chord</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {Object.entries(commonChordDiagrams).slice(0, 8).map(([chordName, fingering]) => (
                                        <ChordDiagram
                                            key={chordName}
                                            chord={chordName}
                                            fingering={fingering}
                                            size={120}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Spotify Music Player */}
                            {chordData.spotify_url && (
                                <div className="mb-8">
                                    <SpotifyPlayer
                                        trackId={chordData.spotify_url}
                                        trackName={chordData.title}
                                        artistName={chordData.artist_name}
                                    />
                                </div>
                            )}

                            {/* Lyrics and Chords */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#00FFFF]">
                                <h3 className="text-xl font-semibold text-[#1A2A3A] mb-6">Lirik dan Chord</h3>
                                <div
                                    className="chord-content whitespace-pre-line font-mono text-sm leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: formattedLyrics }}
                                />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {/* Related Chords */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#00FFFF] mb-8">
                                <h3 className="text-xl font-semibold text-[#1A2A3A] mb-4">Chord Terkait</h3>
                                <div className="space-y-4">
                                    {relatedChords.map((relatedChord) => (
                                        <Link
                                            href={`/chord/${relatedChord.id}`}
                                            key={relatedChord.id}
                                            className="block p-3 border border-gray-200 rounded hover:border-[#00FFFF] hover:bg-[#E0E8EF] transition-colors"
                                        >
                                            <h4 className="font-semibold text-[#1A2A3A] text-sm">{relatedChord.title}</h4>
                                            <p className="text-gray-600 text-xs">{relatedChord.artist}</p>
                                            <span className="inline-block bg-[#E0E8EF] text-[#1A2A3A] text-xs px-2 py-1 rounded-full mt-1">
                                                {relatedChord.difficulty}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#00FFFF]">
                                <h3 className="text-lg font-semibold text-[#1A2A3A] mb-4">Informasi Lagu</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Genre:</span>
                                        <span className="font-medium text-[#1A2A3A]">{chordData.genre_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Tingkat:</span>
                                        <span className="font-medium text-[#1A2A3A]">{chordData.difficulty || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Durasi:</span>
                                        <span className="font-medium text-[#1A2A3A]">{chordData.duration || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Views:</span>
                                        <span className="font-medium text-[#1A2A3A]">{chordData.view_count?.toLocaleString() || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating Chord Controls */}
            <ChordControls
                tempo={chordData.tempo || '120 BPM'}
                currentKey={chordData.key_signature || 'C'}
            />
        </div>
    );
}
