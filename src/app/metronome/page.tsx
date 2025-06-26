'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// Metronome presets
const bpmPresets = [
    { name: "Largo", range: "40-60 BPM", bpm: 50, description: "Very slow, dignified" },
    { name: "Adagio", range: "66-76 BPM", bpm: 70, description: "Slow and expressive" },
    { name: "Andante", range: "76-108 BPM", bpm: 90, description: "Walking pace" },
    { name: "Moderato", range: "108-120 BPM", bpm: 115, description: "Moderate speed" },
    { name: "Allegro", range: "120-168 BPM", bpm: 140, description: "Fast and bright" },
    { name: "Presto", range: "168-200 BPM", bpm: 180, description: "Very fast" }
];

const timeSignatures = [
    { value: "4/4", name: "4/4 (Common Time)", beats: 4, description: "Most common in pop, rock" },
    { value: "3/4", name: "3/4 (Waltz Time)", beats: 3, description: "Waltz, ballads" },
    { value: "2/4", name: "2/4 (March Time)", beats: 2, description: "Marches, polkas" },
    { value: "6/8", name: "6/8 (Compound)", beats: 6, description: "Folk, ballads" }
];

export default function MetronomePage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(120);
    const [timeSignature, setTimeSignature] = useState("4/4");
    const [currentBeat, setCurrentBeat] = useState(1);
    const [volume, setVolume] = useState(0.5);
    const [accentFirstBeat, setAccentFirstBeat] = useState(true);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const beatCountRef = useRef(1);

    // Initialize Web Audio API
    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    // Get current time signature data
    const getCurrentTimeSignature = () => {
        return timeSignatures.find(ts => ts.value === timeSignature) || timeSignatures[0];
    };

    // Play metronome click
    const playClick = async (isAccent = false) => {
        if (!audioContextRef.current) return;

        try {
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }

            const oscillator = audioContextRef.current.createOscillator();
            const gainNode = audioContextRef.current.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);

            // Different frequencies for accent vs normal beat
            oscillator.frequency.setValueAtTime(
                isAccent ? 1000 : 800,
                audioContextRef.current.currentTime
            );
            oscillator.type = 'square';

            // Volume control
            gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
            gainNode.gain.linearRampToValueAtTime(
                volume * (isAccent ? 0.8 : 0.5),
                audioContextRef.current.currentTime + 0.01
            );
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                audioContextRef.current.currentTime + 0.1
            );

            oscillator.start(audioContextRef.current.currentTime);
            oscillator.stop(audioContextRef.current.currentTime + 0.1);

        } catch (error) {
            console.error('Error playing click:', error);
        }
    };

    // Start/stop metronome
    const toggleMetronome = async () => {
        if (isPlaying) {
            // Stop
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setIsPlaying(false);
            setCurrentBeat(1);
            beatCountRef.current = 1;
        } else {
            // Start
            const interval = 60000 / bpm; // Convert BPM to milliseconds
            const maxBeats = getCurrentTimeSignature().beats;

            // Play first beat immediately
            await playClick(accentFirstBeat && beatCountRef.current === 1);
            setCurrentBeat(beatCountRef.current);

            intervalRef.current = setInterval(async () => {
                beatCountRef.current = beatCountRef.current >= maxBeats ? 1 : beatCountRef.current + 1;
                const isAccent = accentFirstBeat && beatCountRef.current === 1;

                await playClick(isAccent);
                setCurrentBeat(beatCountRef.current);
            }, interval);

            setIsPlaying(true);
        }
    };

    // Update metronome when BPM changes
    useEffect(() => {
        if (isPlaying && intervalRef.current) {
            // Restart with new tempo
            toggleMetronome();
            setTimeout(() => toggleMetronome(), 100);
        }
    }, [bpm]);

    // Reset beat count when time signature changes
    useEffect(() => {
        setCurrentBeat(1);
        beatCountRef.current = 1;
    }, [timeSignature]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

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
                                <li className="text-[#00FFFF]">Metronome</li>
                            </ol>
                        </nav>
                    </div>

                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Metronome
                            <span className="text-[#00FFFF]">.</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
                            Metronome online canggih untuk membantu Anda berlatih dengan tempo yang tepat.
                            Dilengkapi visual beat indicator, preset tempo klasik, dan kontrol yang mudah digunakan.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Metronome Control - Main Panel */}
                        <div className="lg:col-span-2">
                            {/* BPM Display */}
                            <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-[#00FFFF] mb-8">
                                <div className="text-center mb-8">
                                    {/* Enhanced BPM Display with Visual Ring */}
                                    <div className="relative mx-auto w-64 h-64 mb-6">
                                        {/* Outer Ring */}
                                        <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                                        {/* Progress Ring */}
                                        <div
                                            className={`absolute inset-0 rounded-full border-8 border-[#00FFFF] transition-all duration-500 ${isPlaying ? 'animate-pulse' : ''
                                                }`}
                                            style={{
                                                borderTopColor: '#00FFFF',
                                                borderRightColor: 'transparent',
                                                borderBottomColor: 'transparent',
                                                borderLeftColor: 'transparent',
                                                transform: `rotate(${(currentBeat - 1) * (360 / getCurrentTimeSignature().beats)}deg)`
                                            }}
                                        ></div>

                                        {/* Center Content */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className={`text-6xl font-bold text-[#1A2A3A] mb-2 transition-all duration-200 ${isPlaying ? 'animate-pulse' : ''
                                                }`}>
                                                {bpm}
                                            </div>
                                            <div className="text-lg text-gray-600 mb-4">BPM</div>

                                            {/* Beat Counter */}
                                            <div className="text-sm text-gray-500">
                                                Beat {currentBeat} of {getCurrentTimeSignature().beats}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enhanced Visual Beat Indicator */}
                                    <div className="flex justify-center space-x-3 mb-8">
                                        {Array.from({ length: getCurrentTimeSignature().beats }, (_, index) => (
                                            <div key={index} className="flex flex-col items-center space-y-2">
                                                <div
                                                    className={`w-8 h-8 rounded-full border-3 transition-all duration-150 transform ${currentBeat === index + 1
                                                        ? 'bg-[#00FFFF] border-[#00FFFF] shadow-lg scale-125 animate-bounce'
                                                        : index === 0 && accentFirstBeat
                                                            ? 'bg-white border-[#B0A0D0] shadow-md'
                                                            : 'bg-white border-gray-300 shadow-sm'
                                                        }`}
                                                >
                                                    {/* Beat number */}
                                                    <div className={`w-full h-full flex items-center justify-center text-xs font-bold ${currentBeat === index + 1 ? 'text-white' : 'text-gray-600'
                                                        }`}>
                                                        {index + 1}
                                                    </div>
                                                </div>
                                                {/* Accent indicator */}
                                                {index === 0 && accentFirstBeat && (
                                                    <div className="text-xs text-[#B0A0D0] font-medium">Accent</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Enhanced Play/Stop Button */}
                                    <button
                                        onClick={toggleMetronome}
                                        className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 ${isPlaying
                                            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                            : 'bg-gradient-to-r from-[#00FFFF] to-[#B0A0D0] hover:from-[#B0A0D0] hover:to-[#00FFFF] text-[#1A2A3A]'
                                            }`}
                                    >
                                        {isPlaying ? (
                                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* Enhanced BPM Controls */}
                                <div className="space-y-6">
                                    {/* BPM Slider with Gradient */}
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-purple-200">
                                        <label className="block text-lg font-semibold text-[#1A2A3A] mb-4 text-center">
                                            🎵 Tempo Control: {bpm} BPM
                                        </label>
                                        <input
                                            type="range"
                                            min="40"
                                            max="200"
                                            value={bpm}
                                            onChange={(e) => setBpm(parseInt(e.target.value))}
                                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider shadow-inner"
                                            style={{
                                                background: `linear-gradient(to right, #00FFFF 0%, #B0A0D0 ${((bpm - 40) / 160) * 100}%, #e5e7eb ${((bpm - 40) / 160) * 100}%, #e5e7eb 100%)`
                                            }}
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                                            <span>40 BPM</span>
                                            <span>120 BPM</span>
                                            <span>200 BPM</span>
                                        </div>
                                    </div>

                                    {/* BPM Quick Controls with Better Styling */}
                                    <div className="flex justify-center space-x-3">
                                        <button
                                            onClick={() => setBpm(Math.max(40, bpm - 10))}
                                            className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                                        >
                                            -10
                                        </button>
                                        <button
                                            onClick={() => setBpm(Math.max(40, bpm - 1))}
                                            className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                                        >
                                            -1
                                        </button>
                                        <button
                                            onClick={() => setBpm(120)}
                                            className="bg-gradient-to-r from-[#00FFFF] to-[#B0A0D0] hover:from-[#B0A0D0] hover:to-[#00FFFF] text-[#1A2A3A] px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            onClick={() => setBpm(Math.min(200, bpm + 1))}
                                            className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                                        >
                                            +1
                                        </button>
                                        <button
                                            onClick={() => setBpm(Math.min(200, bpm + 10))}
                                            className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                                        >
                                            +10
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Settings Panel */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#B0A0D0]">
                                <h3 className="text-xl font-semibold text-[#1A2A3A] mb-6 flex items-center">
                                    <svg className="w-6 h-6 mr-2 text-[#B0A0D0]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                    </svg>
                                    Pengaturan Metronome
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Enhanced Time Signature */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-[#1A2A3A]">
                                            Time Signature
                                        </label>
                                        <select
                                            value={timeSignature}
                                            onChange={(e) => setTimeSignature(e.target.value)}
                                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF] transition-all duration-200 bg-white shadow-sm"
                                        >
                                            {timeSignatures.map((ts) => (
                                                <option key={ts.value} value={ts.value}>
                                                    {ts.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                            <p className="text-sm text-blue-800 font-medium">
                                                📝 {getCurrentTimeSignature().description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Enhanced Volume */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-[#1A2A3A]">
                                            Volume: {Math.round(volume * 100)}%
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={volume}
                                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer shadow-inner"
                                                style={{
                                                    background: `linear-gradient(to right, #B0A0D0 0%, #B0A0D0 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>🔇 Silent</span>
                                            <span>🔊 Loud</span>
                                        </div>
                                    </div>

                                    {/* Enhanced Accent First Beat */}
                                    <div className="md:col-span-2">
                                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                                            <label className="flex items-center space-x-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={accentFirstBeat}
                                                    onChange={(e) => setAccentFirstBeat(e.target.checked)}
                                                    className="w-5 h-5 text-[#00FFFF] bg-gray-100 border-gray-300 rounded focus:ring-[#00FFFF] focus:ring-2 transition-all duration-200"
                                                />
                                                <span className="text-sm font-medium text-[#1A2A3A] flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-[#B0A0D0]" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                                    </svg>
                                                    Accent first beat (downbeat)
                                                </span>
                                            </label>
                                            <p className="text-xs text-gray-600 mt-2 ml-8">
                                                🎵 Makes the first beat of each measure louder and higher pitched for better rhythm emphasis
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {/* Enhanced BPM Presets */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#00FFFF] mb-8">
                                <h3 className="text-xl font-semibold text-[#1A2A3A] mb-4 flex items-center">
                                    <svg className="w-6 h-6 mr-2 text-[#00FFFF]" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                    </svg>
                                    Tempo Presets Klasik
                                </h3>
                                <div className="space-y-3">
                                    {bpmPresets.map((preset) => (
                                        <button
                                            key={preset.name}
                                            onClick={() => setBpm(preset.bpm)}
                                            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-102 hover:shadow-md ${Math.abs(bpm - preset.bpm) <= 5
                                                ? 'border-[#00FFFF] bg-gradient-to-r from-[#E0E8EF] to-blue-50 text-[#1A2A3A] shadow-md'
                                                : 'border-gray-200 hover:border-[#00FFFF] hover:bg-gray-50 text-[#1A2A3A]'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-lg text-[#1A2A3A]">{preset.name}</h4>
                                                <span className={`text-sm font-bold px-3 py-1 rounded-full ${Math.abs(bpm - preset.bpm) <= 5
                                                    ? 'bg-[#00FFFF] text-[#1A2A3A]'
                                                    : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {preset.bpm} BPM
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1 font-medium">{preset.range}</p>
                                            <p className="text-sm text-gray-500 italic">"{preset.description}"</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Enhanced Quick Reference */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#B0A0D0] mb-8">
                                <h3 className="text-lg font-semibold text-[#1A2A3A] mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-[#B0A0D0]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    Panduan Cepat
                                </h3>
                                <div className="space-y-4 text-sm">
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                                        <h4 className="font-bold text-[#1A2A3A] mb-2 flex items-center">
                                            <span className="w-6 h-6 bg-[#00FFFF] text-[#1A2A3A] rounded-full flex items-center justify-center text-xs font-bold mr-2">1</span>
                                            Cara Menggunakan:
                                        </h4>
                                        <ul className="text-gray-600 space-y-1 ml-8">
                                            <li>• Atur BPM sesuai kebutuhan musik</li>
                                            <li>• Pilih time signature yang tepat</li>
                                            <li>• Klik tombol play untuk memulai</li>
                                            <li>• Ikuti ketukan visual dan audio</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                                        <h4 className="font-bold text-[#1A2A3A] mb-2 flex items-center">
                                            <span className="w-6 h-6 bg-[#B0A0D0] text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">2</span>
                                            Tips Berlatih:
                                        </h4>
                                        <ul className="text-gray-600 space-y-1 ml-8">
                                            <li>• Mulai dengan tempo lambat</li>
                                            <li>• Tingkatkan BPM secara bertahap</li>
                                            <li>• Latih ketepatan timing konsisten</li>
                                            <li>• Gunakan accent untuk groove yang lebih baik</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                                        <h4 className="font-bold text-[#1A2A3A] mb-2 flex items-center">
                                            <span className="w-6 h-6 bg-orange-400 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">💡</span>
                                            Pro Tips:
                                        </h4>
                                        <ul className="text-gray-600 space-y-1 ml-8">
                                            <li>• Gunakan headphone untuk timing yang lebih akurat</li>
                                            <li>• Praktik dengan berbagai time signature</li>
                                            <li>• Fokus pada downbeat (beat pertama)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Advertisement Placeholder */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#00FFFF]">
                                <div className="bg-gray-200 h-60 rounded flex items-center justify-center text-gray-500">
                                    Advertisement Space
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
