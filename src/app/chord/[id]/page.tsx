import Link from "next/link";
import { notFound } from "next/navigation";
import ChordControls from "@/components/ui/chord-controls";
import ChordDiagram from "@/components/ui/chord-diagram";
import SpotifyPlayer from "@/components/ui/spotify-player";
import { highlightChords } from '@/utils/chord-highlighter';

// This would typically come from a database or API
const getChordData = async (id: string) => {
    // Placeholder data - in real app, this would fetch from database/API
    const chordDatabase = {
        "1": {
            id: "1", title: "Bintang di Surga",
            artist: "Peterpan",
            difficulty: "Intermediate",
            genre: "Pop Rock",
            key: "Am",
            capo: "Fret 2",
            tempo: "120 BPM",
            duration: "4:32",
            lyrics: `[Intro]
Am F C G
Am F C G

[Verse 1]
Am                F
Ku menatap langit sore ini
C                 G
Berharap engkau kan kembali
Am               F
Menghapus sepi di hati ini
C                G
Kau bintang di surga

[Pre-Chorus]
F              G
Tak ingin ku terluka
Am             F
Seperti yang dulu kala
F              G
Saat kau tinggalkan aku

[Chorus]
C               G
Kau bintang di surga
Am              F
Yang tak kan pernah ku raih
C               G
Kau bintang di surga
Am              F              G
Pelita hati yang suci ini

[Verse 2]
Am               F
Ku coba untuk melupakan
C                G
Semua yang pernah terjadi
Am               F
Namun ku tak bisa menghapus
C                G
Bayangmu di hati

[Pre-Chorus]
F              G
Tak ingin ku terluka
Am             F
Seperti yang dulu kala
F              G
Saat kau tinggalkan aku

[Chorus]
C               G
Kau bintang di surga
Am              F
Yang tak kan pernah ku raih
C               G
Kau bintang di surga
Am              F              G
Pelita hati yang suci ini

[Bridge]
F        G       Am
Andai waktu bisa terulang
F         G        C
Kan ku jaga cinta ini
F        G       Am
Hingga nafas penghabisan
F            G
Tapi semua tlah terlambat

[Chorus]
C               G
Kau bintang di surga
Am              F
Yang tak kan pernah ku raih
C               G
Kau bintang di surga
Am              F              G
Pelita hati yang suci ini

[Outro]
Am F C G
Am F C G
Am`,
            chordDiagrams: {
                "Am": "x02210",
                "F": "133211",
                "C": "x32010",
                "G": "320003"
            },
            spotifyTrackId: "4uLU6hMCjMI75M1A2tKUQC", // example Spotify track ID
            tags: ["populer", "sedih", "cinta", "peterpan", "pop rock"],
            addedDate: "2024-01-15",
            views: 15420,
            likes: 892
        },
        "2": {
            id: "2",
            title: "Kau Adalah",
            artist: "Isyana Sarasvati",
            difficulty: "Easy",
            genre: "Pop",
            key: "C",
            capo: "No Capo",
            tempo: "90 BPM",
            duration: "3:45",
            lyrics: `[Intro]
C Am F G
C Am F G

[Verse 1]
C                 Am
Kau adalah mentari pagi
F                 G
Yang selalu menerangi hariku
C                 Am
Kau adalah angin sepoi
F                 G
Yang menghapus resah gelisahku

[Chorus]
F           G          C        Am
Kau adalah segalanya bagiku
F           G          C
Tanpamu aku tak berarti
F           G          Am       F
Kau adalah cinta sejatiku
          G         C
Yang takkan pernah terganti

[Verse 2]
C                 Am
Saat badai menghadang
F                 G
Kau selalu ada bersamaku
C                 Am
Saat dunia terasa kelam
F                 G
Kau jadi cahaya hidupku

[Chorus]
F           G          C        Am
Kau adalah segalanya bagiku
F           G          C
Tanpamu aku tak berarti
F           G          Am       F
Kau adalah cinta sejatiku
          G         C
Yang takkan pernah terganti

[Bridge]
Am        F
Selamanya
G           C
Akan ku jaga cinta ini
Am        F
Selamanya
G           C
Kau dalam hatiku

[Outro]
C Am F G
C Am F G
C`,
            chordDiagrams: {
                "C": "x32010",
                "Am": "x02210",
                "F": "133211",
                "G": "320003"
            },
            spotifyTrackId: "5Hroj5K7vLpIG3KmBhGFUt", // Example Spotify track ID
            tags: ["mudah", "cinta", "isyana", "pop", "romantis"],
            addedDate: "2024-02-20",
            views: 8745,
            likes: 623
        }
    };

    const chord = chordDatabase[id as keyof typeof chordDatabase];
    return chord || null;
};

export default async function ChordPage({ params }: { params: { id: string } }) {
    const chord = await getChordData(params.id);

    if (!chord) {
        notFound();
    }

    // Related chords (placeholder)
    const relatedChords = [
        { id: "3", title: "Aku Milikmu", artist: "Iwan Fals", difficulty: "Advanced" },
        { id: "4", title: "Mencari Alasan", artist: "Exists", difficulty: "Intermediate" },
        { id: "5", title: "Separuh Aku", artist: "Noah", difficulty: "Easy" },
        { id: "6", title: "Dan", artist: "Sheila on 7", difficulty: "Intermediate" },
    ];

    const formattedLyrics = highlightChords(chord.lyrics);

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
                                <li className="text-[#00FFFF]">{chord.title}</li>
                            </ol>
                        </nav>
                    </div>

                    {/* Song Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                {chord.title}
                                <span className="text-[#00FFFF]">.</span>
                            </h1>
                            <p className="text-2xl text-gray-300 mb-6">by {chord.artist}</p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {chord.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-[#2A3A4A] text-[#00FFFF] px-3 py-1 rounded-full text-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center space-x-6 text-gray-300">
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zM4.93 5.07a6.984 6.984 0 000 9.86 6.984 6.984 0 009.86 0 6.984 6.984 0 000-9.86 6.984 6.984 0 00-9.86 0z" clipRule="evenodd" />
                                    </svg>
                                    {chord.views.toLocaleString()} views
                                </span>
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                    {chord.likes} likes
                                </span>
                            </div>
                        </div>

                        {/* Song Details Card */}
                        <div className="bg-[#2A3A4A] p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-4 text-[#00FFFF]">Detail Lagu</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Genre:</span>
                                    <span className="text-white">{chord.genre}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Kunci:</span>
                                    <span className="text-[#00FFFF] font-semibold">{chord.key}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Capo:</span>
                                    <span className="text-white">{chord.capo}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Tempo:</span>
                                    <span className="text-white">{chord.tempo}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Durasi:</span>
                                    <span className="text-white">{chord.duration}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Kesulitan:</span>
                                    <span className={`px-2 py-1 rounded text-sm ${chord.difficulty === 'Easy' ? 'bg-green-600' :
                                        chord.difficulty === 'Intermediate' ? 'bg-yellow-600' :
                                            'bg-red-600'
                                        }`}>
                                        {chord.difficulty}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">                        {/* Chord Content */}
                        <div className="lg:col-span-3">                            {/* Chord Diagrams */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#00FFFF] mb-8">
                                <h3 className="text-xl font-semibold text-[#1A2A3A] mb-4">Diagram Chord</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {Object.entries(chord.chordDiagrams).map(([chordName, fingering]) => (
                                        <ChordDiagram
                                            key={chordName}
                                            chord={chordName}
                                            fingering={fingering}
                                            size={120}
                                        />
                                    ))}                                </div>
                            </div>                            {/* Spotify Music Player */}
                            {(chord as any).spotifyTrackId && (
                                <div className="mb-8">
                                    <SpotifyPlayer
                                        trackId={(chord as any).spotifyTrackId}
                                        trackName={chord.title}
                                        artistName={chord.artist}
                                        spotifyUrl={`https://open.spotify.com/search/${encodeURIComponent(`${chord.title} ${chord.artist}`)}`}
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

                            {/* Advertisement Placeholder */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#00FFFF] mb-8">
                                <div className="bg-gray-200 h-60 rounded flex items-center justify-center text-gray-500">
                                    Advertisement Space
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#00FFFF]">
                                <h3 className="text-lg font-semibold text-[#1A2A3A] mb-4">Aksi Cepat</h3>
                                <div className="space-y-3">
                                    <button className="w-full bg-[#00FFFF] text-[#1A2A3A] py-2 px-4 rounded font-medium hover:bg-[#B0A0D0] transition-colors">
                                        Simpan ke Favorit
                                    </button>
                                    <button className="w-full bg-[#1A2A3A] text-white py-2 px-4 rounded hover:bg-[#2A3A4A] transition-colors">
                                        Download PDF
                                    </button>
                                    <button className="w-full bg-transparent border-2 border-[#1A2A3A] text-[#1A2A3A] py-2 px-4 rounded hover:bg-[#1A2A3A] hover:text-white transition-colors">
                                        Bagikan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>                </div>
            </section>            {/* Floating Chord Controls */}
            <ChordControls currentKey={chord.key} />
        </div>
    );
}
