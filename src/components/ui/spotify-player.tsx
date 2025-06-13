'use client';

interface SpotifyPlayerProps {
    trackId?: string;
    trackName: string;
    artistName: string;
    spotifyUrl?: string;
}

const SpotifyPlayer = ({
    trackId,
    trackName,
    artistName,
    spotifyUrl
}: SpotifyPlayerProps) => {
    // Generate Spotify embed URL
    const spotifyEmbedUrl = trackId
        ? `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`
        : null;

    // Fallback Spotify search URL
    const spotifySearchUrl = spotifyUrl || `https://open.spotify.com/search/${encodeURIComponent(`${trackName} ${artistName}`)}`;

    return (
        <div className="bg-white rounded-lg shadow-md border-t-4 border-[#1DB954] overflow-hidden">
            {/* Header */}
            <div className="bg-[#1DB954] text-white p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.48.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold">Spotify Player</h3>
                            <p className="text-green-100 text-sm">Legal streaming</p>
                        </div>
                    </div>
                    <a
                        href={spotifySearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        title="Buka di Spotify"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </a>                </div>
            </div>

            {/* Player Content */}
            <div className="p-4">
                {/* Spotify Embed */}
                {spotifyEmbedUrl ? (
                    <div className="rounded-lg overflow-hidden">
                        <iframe
                            src={spotifyEmbedUrl}
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowTransparency={true}
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            className="rounded-lg"
                        />
                    </div>
                ) : (
                    <div className="p-6 bg-gray-50 rounded-lg text-center">
                        <p className="text-gray-600 mb-4">
                            Track ID Spotify tidak tersedia. Klik tombol di bawah untuk mencari lagu ini di Spotify.
                        </p>
                        <a
                            href={spotifySearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 bg-[#1DB954] hover:bg-[#1ed760] text-white px-6 py-3 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span>Cari di Spotify</span>
                        </a>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="bg-gray-50 p-3 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                    <span>🎵 Streaming legal dengan Spotify</span>
                </div>
            </div>
        </div>
    );
};

export default SpotifyPlayer;