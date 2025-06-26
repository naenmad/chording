'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// Guitar tuning data
const guitarTunings = {
    standard: {
        name: "Standard Tuning",
        description: "Tuning gitar paling umum digunakan",
        tuning: ["E", "A", "D", "G", "B", "E"],
        frequencies: [82.41, 110.00, 146.83, 196.00, 246.94, 329.63],
        difficulty: "Beginner"
    },
    dropD: {
        name: "Drop D",
        description: "Menurunkan senar 6 (E) menjadi D",
        tuning: ["D", "A", "D", "G", "B", "E"],
        frequencies: [73.42, 110.00, 146.83, 196.00, 246.94, 329.63],
        difficulty: "Beginner"
    },
    dadgad: {
        name: "DADGAD",
        description: "Tuning alternatif populer untuk fingerstyle",
        tuning: ["D", "A", "D", "G", "A", "D"],
        frequencies: [73.42, 110.00, 146.83, 196.00, 220.00, 293.66],
        difficulty: "Intermediate"
    },
    openG: {
        name: "Open G",
        description: "Tuning terbuka yang menghasilkan chord G major",
        tuning: ["D", "G", "D", "G", "B", "D"],
        frequencies: [73.42, 98.00, 146.83, 196.00, 246.94, 293.66],
        difficulty: "Intermediate"
    },
    openD: {
        name: "Open D",
        description: "Tuning terbuka yang menghasilkan chord D major",
        tuning: ["D", "A", "D", "F#", "A", "D"],
        frequencies: [73.42, 110.00, 146.83, 185.00, 220.00, 293.66],
        difficulty: "Intermediate"
    },
    halfStep: {
        name: "Half Step Down",
        description: "Standard tuning diturunkan setengah nada",
        tuning: ["D#", "G#", "C#", "F#", "A#", "D#"],
        frequencies: [77.78, 103.83, 138.59, 185.00, 233.08, 311.13],
        difficulty: "Beginner"
    }
};

export default function TuningPage() {
    const [selectedTuning, setSelectedTuning] = useState('standard');
    const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>({});
    const [currentString, setCurrentString] = useState<number | null>(null);
    const [detectedString, setDetectedString] = useState<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Pitch detection states
    const [isListening, setIsListening] = useState(false);
    const [detectedFrequency, setDetectedFrequency] = useState<number | null>(null);
    const [detectedNote, setDetectedNote] = useState<string>('');
    const [tuningAccuracy, setTuningAccuracy] = useState<number | null>(null);
    const [tuningStatus, setTuningStatus] = useState<'perfect' | 'sharp' | 'flat' | null>(null);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const [stringAnimations, setStringAnimations] = useState<{ [key: number]: boolean }>({});

    // Initialize Web Audio API
    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            stopPitchDetection();
        };
    }, []);

    // Pitch detection functions
    const getNoteName = (frequency: number): string => {
        const A4 = 440;
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        const semitones = Math.round(12 * Math.log2(frequency / A4));
        const noteIndex = (semitones + 57) % 12; // 57 = 9 (A) + 4*12 (octaves to get to A4)
        const octave = Math.floor((semitones + 57) / 12);

        return `${noteNames[noteIndex]}${octave}`;
    };

    const getTuningAccuracy = (frequency: number, targetFrequency: number): number => {
        const cents = 1200 * Math.log2(frequency / targetFrequency);
        return Math.round(cents);
    };

    const detectPitch = (audioBuffer: Float32Array, sampleRate: number): number | null => {
        // Autocorrelation-based pitch detection
        const bufferSize = audioBuffer.length;
        const correlations = new Array(bufferSize).fill(0);

        // Calculate autocorrelation
        for (let lag = 1; lag < bufferSize / 2; lag++) {
            let correlation = 0;
            for (let i = 0; i < bufferSize - lag; i++) {
                correlation += audioBuffer[i] * audioBuffer[i + lag];
            }
            correlations[lag] = correlation;
        }

        // Find the first peak that's above a threshold
        let maxCorrelation = 0;
        let bestLag = -1;

        for (let lag = 20; lag < bufferSize / 2; lag++) { // Start from lag 20 to avoid noise
            if (correlations[lag] > maxCorrelation && correlations[lag] > correlations[lag - 1] && correlations[lag] > correlations[lag + 1]) {
                maxCorrelation = correlations[lag];
                bestLag = lag;
                break;
            }
        }

        if (bestLag === -1 || maxCorrelation < 0.3) {
            return null; // No clear pitch detected
        }

        return sampleRate / bestLag;
    };

    const startPitchDetection = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                }
            });

            if (!audioContextRef.current) {
                audioContextRef.current = new AudioContext();
            }

            const source = audioContextRef.current.createMediaStreamSource(stream);
            const analyser = audioContextRef.current.createAnalyser();

            analyser.fftSize = 4096;
            analyser.smoothingTimeConstant = 0.8;

            source.connect(analyser);

            setMediaStream(stream);
            analyserRef.current = analyser;
            setIsListening(true);

            // Start the pitch detection loop
            const detectLoop = () => {
                if (!analyserRef.current) return;

                const bufferLength = analyserRef.current.fftSize;
                const dataArray = new Float32Array(bufferLength);
                analyserRef.current.getFloatTimeDomainData(dataArray);

                // Check if there's enough signal
                const rms = Math.sqrt(dataArray.reduce((sum, val) => sum + val * val, 0) / dataArray.length);

                if (rms > 0.01) { // Only detect if there's sufficient signal
                    const frequency = detectPitch(dataArray, audioContextRef.current!.sampleRate);

                    if (frequency && frequency > 70 && frequency < 800) { // Guitar frequency range
                        setDetectedFrequency(frequency);
                        const note = getNoteName(frequency);
                        setDetectedNote(note);

                        // Find the closest target string
                        const currentTuning = guitarTunings[selectedTuning as keyof typeof guitarTunings];
                        let closestString = -1;
                        let smallestDiff = Infinity;

                        currentTuning.frequencies.forEach((targetFreq: number, index: number) => {
                            const diff = Math.abs(frequency - targetFreq);
                            if (diff < smallestDiff) {
                                smallestDiff = diff;
                                closestString = index;
                            }
                        });

                        if (closestString !== -1) {
                            const accuracy = getTuningAccuracy(frequency, currentTuning.frequencies[closestString]);
                            setTuningAccuracy(accuracy);
                            setCurrentString(closestString);
                            setDetectedString(closestString);

                            // Animate the detected string
                            setStringAnimations(prev => ({ ...prev, [closestString]: true }));
                            setTimeout(() => {
                                setStringAnimations(prev => ({ ...prev, [closestString]: false }));
                            }, 200);

                            // Set tuning status
                            if (Math.abs(accuracy) <= 5) {
                                setTuningStatus('perfect');
                            } else if (accuracy > 5) {
                                setTuningStatus('sharp');
                            } else {
                                setTuningStatus('flat');
                            }
                        }
                    } else {
                        setDetectedFrequency(null);
                        setDetectedNote('');
                        setTuningAccuracy(null);
                        setDetectedString(null);
                        setTuningStatus(null);
                    }
                } else {
                    setDetectedFrequency(null);
                    setDetectedNote('');
                    setTuningAccuracy(null);
                    setDetectedString(null);
                    setTuningStatus(null);
                }

                animationFrameRef.current = requestAnimationFrame(detectLoop);
            };

            detectLoop();

        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Could not access microphone. Please allow microphone access to use pitch detection.');
        }
    };

    const stopPitchDetection = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            setMediaStream(null);
        }

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        analyserRef.current = null;
        setIsListening(false);
        setDetectedFrequency(null);
        setDetectedNote('');
        setTuningAccuracy(null);
        setCurrentString(null);
        setDetectedString(null);
        setTuningStatus(null);
    };

    // Create guitar-like sound using additive synthesis
    const createGuitarTone = (frequency: number, stringIndex: number, audioContext: AudioContext): { oscillators: OscillatorNode[], gainNode: GainNode } => {
        const gainNode = audioContext.createGain();
        const oscillators: OscillatorNode[] = [];

        // Different harmonic content for different strings
        let harmonics;

        if (stringIndex >= 4) {
            // Bass strings (E, A) - warmer, more fundamental
            harmonics = [
                { freq: frequency, gain: 1.0 },
                { freq: frequency * 2, gain: 0.6 },
                { freq: frequency * 3, gain: 0.3 },
                { freq: frequency * 4, gain: 0.15 },
                { freq: frequency * 5, gain: 0.08 },
            ];
        } else if (stringIndex >= 2) {
            // Mid strings (D, G) - balanced
            harmonics = [
                { freq: frequency, gain: 0.9 },
                { freq: frequency * 2, gain: 0.5 },
                { freq: frequency * 3, gain: 0.3 },
                { freq: frequency * 4, gain: 0.2 },
                { freq: frequency * 5, gain: 0.12 },
                { freq: frequency * 6, gain: 0.08 },
            ];
        } else {
            // Treble strings (B, E) - brighter, more harmonics
            harmonics = [
                { freq: frequency, gain: 0.8 },
                { freq: frequency * 2, gain: 0.6 },
                { freq: frequency * 3, gain: 0.4 },
                { freq: frequency * 4, gain: 0.25 },
                { freq: frequency * 5, gain: 0.15 },
                { freq: frequency * 6, gain: 0.1 },
                { freq: frequency * 7, gain: 0.08 },
            ];
        }

        harmonics.forEach(({ freq, gain }) => {
            const osc = audioContext.createOscillator();
            const harmGain = audioContext.createGain();

            // Use different waveforms for different frequency ranges
            if (freq < 200) {
                osc.type = 'sawtooth'; // Warmer for bass
            } else if (freq < 600) {
                osc.type = 'square'; // Mid-range clarity
            } else {
                osc.type = 'triangle'; // Smoother for treble
            }

            osc.frequency.setValueAtTime(freq, audioContext.currentTime);
            harmGain.gain.setValueAtTime(gain, audioContext.currentTime);

            osc.connect(harmGain);
            harmGain.connect(gainNode);

            oscillators.push(osc);
        });

        return { oscillators, gainNode };
    };

    // Apply guitar-like envelope and effects
    const applyGuitarEnvelope = (gainNode: GainNode, stringIndex: number, audioContext: AudioContext) => {
        const currentTime = audioContext.currentTime;

        // Different envelope characteristics for different strings
        if (stringIndex >= 4) {
            // Bass strings - slower attack, longer sustain
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.4, currentTime + 0.02); // Slightly slower attack
            gainNode.gain.exponentialRampToValueAtTime(0.3, currentTime + 0.15); // Decay
            gainNode.gain.exponentialRampToValueAtTime(0.2, currentTime + 1.0); // Longer sustain
            gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 3.5); // Longer release
        } else if (stringIndex >= 2) {
            // Mid strings - balanced
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.35, currentTime + 0.015);
            gainNode.gain.exponentialRampToValueAtTime(0.25, currentTime + 0.12);
            gainNode.gain.exponentialRampToValueAtTime(0.18, currentTime + 0.8);
            gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 3.0);
        } else {
            // Treble strings - quick attack, faster decay
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 0.01); // Quick attack
            gainNode.gain.exponentialRampToValueAtTime(0.2, currentTime + 0.08); // Faster decay
            gainNode.gain.exponentialRampToValueAtTime(0.15, currentTime + 0.5); // Shorter sustain
            gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 2.5); // Shorter release
        }
    };

    // Play tuning tone with guitar-like sound
    const playTone = async (frequency: number, stringIndex: number) => {
        if (!audioContextRef.current) return;

        try {
            // Resume audio context if suspended
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }

            // Stop any currently playing tones
            stopAllTones();

            // Create guitar-like tone
            const { oscillators, gainNode } = createGuitarTone(frequency, stringIndex, audioContextRef.current);

            // Add low-pass filter for warmer sound
            const lowPassFilter = audioContextRef.current.createBiquadFilter();
            lowPassFilter.type = 'lowpass';
            lowPassFilter.frequency.setValueAtTime(3000 + (stringIndex * 500), audioContextRef.current.currentTime); // Higher cutoff for higher strings
            lowPassFilter.Q.setValueAtTime(1, audioContextRef.current.currentTime);

            // Add some reverb-like effect using delay
            const delayNode = audioContextRef.current.createDelay();
            const delayGain = audioContextRef.current.createGain();
            const feedbackGain = audioContextRef.current.createGain();

            delayNode.delayTime.setValueAtTime(0.03, audioContextRef.current.currentTime);
            delayGain.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
            feedbackGain.gain.setValueAtTime(0.2, audioContextRef.current.currentTime);

            // Audio routing: gainNode -> filter -> delay -> output
            gainNode.connect(lowPassFilter);
            lowPassFilter.connect(delayNode);
            lowPassFilter.connect(audioContextRef.current.destination); // Direct signal

            // Delay feedback loop
            delayNode.connect(delayGain);
            delayGain.connect(audioContextRef.current.destination);
            delayNode.connect(feedbackGain);
            feedbackGain.connect(delayNode);

            // Apply guitar envelope
            applyGuitarEnvelope(gainNode, stringIndex, audioContextRef.current);

            // Start all oscillators
            oscillators.forEach(osc => osc.start());

            setIsPlaying(prev => ({ ...prev, [stringIndex]: true }));
            setCurrentString(stringIndex);

            // Auto stop after 3 seconds
            setTimeout(() => {
                stopTone(stringIndex);
            }, 3000);

            // Store oscillators reference for manual stopping
            (audioContextRef.current as any)._currentOscillators = oscillators;
            (audioContextRef.current as any)._currentStringIndex = stringIndex;

        } catch (error) {
            console.error('Error playing tone:', error);
        }
    };

    const stopTone = (stringIndex: number) => {
        if (audioContextRef.current && (audioContextRef.current as any)._currentOscillators) {
            const oscillators = (audioContextRef.current as any)._currentOscillators;
            const currentStringIndex = (audioContextRef.current as any)._currentStringIndex;

            if (currentStringIndex === stringIndex) {
                try {
                    oscillators.forEach((osc: OscillatorNode) => {
                        osc.stop();
                    });
                } catch (error) {
                    // Oscillators might already be stopped
                }
                (audioContextRef.current as any)._currentOscillators = null;
                (audioContextRef.current as any)._currentStringIndex = null;
            }
        }
        setIsPlaying(prev => ({ ...prev, [stringIndex]: false }));
        if (currentString === stringIndex) {
            setCurrentString(null);
        }
    };

    const stopAllTones = () => {
        Object.keys(isPlaying).forEach(key => {
            if (isPlaying[parseInt(key)]) {
                stopTone(parseInt(key));
            }
        });
    };

    const currentTuningData = guitarTunings[selectedTuning as keyof typeof guitarTunings];

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
                                <li className="text-[#00FFFF]">Guitar Tuning</li>
                            </ol>
                        </nav>
                    </div>

                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Guitar Tuning
                            <span className="text-[#00FFFF]">.</span>
                        </h1>                            <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
                            Setel gitar Anda dengan mudah menggunakan tuner online kami dengan suara referensi yang realistis.
                            Pilih dari berbagai jenis tuning dan dengarkan nada referensi yang menyerupai suara gitar asli.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Guitar Tuner - Main Panel */}
                        <div className="lg:col-span-2">
                            {/* Current Tuning Info */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#00FFFF] mb-8">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-[#1A2A3A] mb-2">
                                        {currentTuningData.name}
                                    </h2>
                                    <p className="text-gray-600 mb-4">{currentTuningData.description}</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${currentTuningData.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                                        currentTuningData.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {currentTuningData.difficulty}
                                    </span>
                                </div>

                                {/* Guitar Neck Visualization */}
                                <div className="bg-gradient-to-b from-amber-50 to-amber-100 p-6 rounded-lg mb-6 overflow-hidden">
                                    <h3 className="text-lg font-semibold text-[#1A2A3A] mb-6 text-center">
                                        🎸 Auto Guitar Tuner - Petik senar atau dengar nada referensi yang realistis
                                    </h3>

                                    {/* Guitar Fretboard */}
                                    <div className="relative bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 rounded-lg p-6 shadow-inner">
                                        {/* Fret Markers */}
                                        <div className="absolute top-0 left-0 right-0 h-full">
                                            {[0, 1, 2, 3, 4].map((fret) => (
                                                <div
                                                    key={fret}
                                                    className="absolute top-0 bottom-0 w-0.5 bg-gray-400 opacity-30"
                                                    style={{ left: `${20 + (fret * 15)}%` }}
                                                />
                                            ))}
                                            {/* Position markers */}
                                            <div className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-500 rounded-full opacity-50" style={{ left: '35%' }} />
                                            <div className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-500 rounded-full opacity-50" style={{ left: '50%' }} />
                                        </div>

                                        {/* Guitar Strings with Advanced Visualization */}
                                        <div className="relative space-y-4">
                                            {currentTuningData.tuning.map((note, index) => {
                                                const stringIndex = 5 - index; // Reverse for guitar string order
                                                const isCurrentlyPlaying = isPlaying[stringIndex];
                                                const isCurrentlyDetected = detectedString === stringIndex && isListening;
                                                const isBeingAnimated = stringAnimations[stringIndex];
                                                const stringWidth = Math.max(2, 6 - index); // Thicker strings are wider

                                                // Calculate tuning status for this string
                                                let tuningStatusForString = 'unknown';
                                                let tuningAccuracyForString = null;
                                                if (isCurrentlyDetected && tuningAccuracy !== null) {
                                                    tuningAccuracyForString = tuningAccuracy;
                                                    if (Math.abs(tuningAccuracy) <= 5) tuningStatusForString = 'perfect';
                                                    else if (tuningAccuracy > 5) tuningStatusForString = 'sharp';
                                                    else tuningStatusForString = 'flat';
                                                }

                                                return (
                                                    <div key={stringIndex} className="relative">
                                                        {/* String Container */}
                                                        <div className="flex items-center space-x-4">
                                                            {/* String Number & Tuning Status */}
                                                            <div className="w-16 flex flex-col items-center">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-all duration-200 ${isCurrentlyDetected
                                                                    ? 'bg-[#00FFFF] text-[#1A2A3A] animate-pulse scale-110'
                                                                    : 'bg-[#1A2A3A] text-white'
                                                                    }`}>
                                                                    {stringIndex + 1}
                                                                </div>
                                                                {/* Tuning Status Indicator */}
                                                                {isCurrentlyDetected && tuningStatusForString !== 'unknown' && (
                                                                    <div className={`mt-1 text-xs font-bold ${tuningStatusForString === 'perfect' ? 'text-green-600' :
                                                                        tuningStatusForString === 'sharp' ? 'text-red-600' :
                                                                            'text-orange-600'
                                                                        }`}>
                                                                        {tuningStatusForString === 'perfect' ? '✓' :
                                                                            tuningStatusForString === 'sharp' ? '↑' : '↓'}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Guitar String Line */}
                                                            <div className="flex-1 relative">
                                                                {/* String Shadow */}
                                                                <div
                                                                    className="absolute top-0.5 left-0 right-0 rounded-full bg-black opacity-20"
                                                                    style={{ height: `${stringWidth}px` }}
                                                                />
                                                                {/* Main String */}
                                                                <div
                                                                    className={`relative rounded-full cursor-pointer transition-all duration-200 ${isCurrentlyPlaying
                                                                        ? 'bg-gradient-to-r from-[#00FFFF] to-[#B0A0D0] shadow-lg animate-pulse scale-105'
                                                                        : isCurrentlyDetected
                                                                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg scale-105 animate-pulse'
                                                                            : isBeingAnimated
                                                                                ? 'bg-gradient-to-r from-blue-400 to-purple-400 shadow-md animate-bounce scale-102'
                                                                                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 shadow-sm'
                                                                        }`}
                                                                    style={{ height: `${stringWidth}px` }}
                                                                    onClick={() => {
                                                                        if (isCurrentlyPlaying) {
                                                                            stopTone(stringIndex);
                                                                        } else {
                                                                            playTone(currentTuningData.frequencies[index], stringIndex);
                                                                        }
                                                                    }}
                                                                >
                                                                    {/* String Vibration Effect */}
                                                                    {(isCurrentlyPlaying || isCurrentlyDetected || isBeingAnimated) && (
                                                                        <div className={`absolute inset-0 rounded-full ${isCurrentlyPlaying ? 'bg-white' :
                                                                            isCurrentlyDetected ? 'bg-yellow-200' :
                                                                                'bg-blue-200'
                                                                            } opacity-30 animate-ping`} />
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Note Display & Tuning Info */}
                                                            <div className="w-20 text-center">
                                                                <div className={`text-2xl font-bold transition-all duration-200 ${isCurrentlyPlaying ? 'text-[#00FFFF] transform scale-110' :
                                                                    isCurrentlyDetected ? 'text-orange-600 transform scale-110' :
                                                                        'text-[#1A2A3A]'
                                                                    }`}>
                                                                    {note}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {currentTuningData.frequencies[index].toFixed(1)}Hz
                                                                </div>
                                                                {/* Tuning Guidance */}
                                                                {isCurrentlyDetected && tuningAccuracyForString !== null && (
                                                                    <div className="mt-1">
                                                                        <div className={`text-xs font-bold ${tuningStatusForString === 'perfect' ? 'text-green-600' :
                                                                            tuningStatusForString === 'sharp' ? 'text-red-600' :
                                                                                'text-orange-600'
                                                                            }`}>
                                                                            {tuningStatusForString === 'perfect' ? 'PERFECT!' :
                                                                                tuningStatusForString === 'sharp' ? 'TOO HIGH' : 'TOO LOW'}
                                                                        </div>
                                                                        <div className="text-xs text-gray-600">
                                                                            {tuningAccuracyForString > 0 ? '+' : ''}{tuningAccuracyForString} cents
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Tuning Direction Arrows */}
                                                            <div className="w-16 flex flex-col items-center justify-center">
                                                                {isCurrentlyDetected && tuningStatusForString !== 'unknown' && tuningStatusForString !== 'perfect' && (
                                                                    <div className="flex flex-col items-center animate-bounce">
                                                                        {tuningStatusForString === 'sharp' ? (
                                                                            <>
                                                                                <div className="text-red-500 text-xl font-bold animate-pulse">↓</div>
                                                                                <div className="text-xs text-red-600 font-medium">Loosen</div>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <div className="text-orange-500 text-xl font-bold animate-pulse">↑</div>
                                                                                <div className="text-xs text-orange-600 font-medium">Tighten</div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {isCurrentlyDetected && tuningStatusForString === 'perfect' && (
                                                                    <div className="flex flex-col items-center">
                                                                        <div className="text-green-500 text-xl animate-pulse">✓</div>
                                                                        <div className="text-xs text-green-600 font-medium">Perfect!</div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Play/Stop Button */}
                                                            <button
                                                                onClick={() => {
                                                                    if (isCurrentlyPlaying) {
                                                                        stopTone(stringIndex);
                                                                    } else {
                                                                        playTone(currentTuningData.frequencies[index], stringIndex);
                                                                    }
                                                                }}
                                                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${isCurrentlyPlaying
                                                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                                                    : 'bg-[#00FFFF] hover:bg-[#B0A0D0] text-[#1A2A3A]'
                                                                    }`}
                                                            >
                                                                {isCurrentlyPlaying ? (
                                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Guitar Body Hint */}
                                        <div className="mt-4 text-center">
                                            <div className="inline-block bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                                                🎸 Guitar Body
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Control Buttons */}
                                <div className="flex justify-center space-x-4 mb-6">
                                    <button
                                        onClick={() => {
                                            // Play all strings in sequence
                                            currentTuningData.tuning.forEach((_, index) => {
                                                const stringIndex = 5 - index;
                                                setTimeout(() => {
                                                    playTone(currentTuningData.frequencies[index], stringIndex);
                                                }, index * 800); // 800ms delay between each string
                                            });
                                        }}
                                        className="bg-[#00FFFF] hover:bg-[#B0A0D0] text-[#1A2A3A] px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-md hover:shadow-lg"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                        <span>Mainkan Semua</span>
                                    </button>

                                    <button
                                        onClick={stopAllTones}
                                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-md hover:shadow-lg"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>Stop Semua</span>
                                    </button>
                                </div>

                                {/* Pitch Detection Section */}
                                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border-2 border-purple-200">
                                    <h3 className="text-lg font-semibold text-[#1A2A3A] mb-4 text-center flex items-center justify-center space-x-2">
                                        <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                                        </svg>
                                        <span>Auto Tuner - Deteksi Pitch</span>
                                    </h3>

                                    {/* Microphone Controls */}
                                    <div className="text-center mb-4">
                                        <button
                                            onClick={isListening ? stopPitchDetection : startPitchDetection}
                                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 mx-auto shadow-md hover:shadow-lg ${isListening
                                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                                : 'bg-green-500 hover:bg-green-600 text-white'
                                                }`}
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                                            </svg>
                                            <span>{isListening ? 'Stop Listening' : 'Start Listening'}</span>
                                        </button>
                                        {isListening && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                🎵 Listening... Mainkan senar gitar Anda
                                            </p>
                                        )}
                                    </div>

                                    {/* Pitch Detection Display */}
                                    {isListening && (
                                        <div className="space-y-4">
                                            {/* Detected Note */}
                                            <div className="text-center">
                                                <div className="bg-white p-4 rounded-lg shadow-inner">
                                                    <div className="text-sm text-gray-600 mb-1">Detected Note:</div>
                                                    <div className={`text-3xl font-bold ${detectedNote ? 'text-purple-600' : 'text-gray-400'}`}>
                                                        {detectedNote || '--'}
                                                    </div>
                                                    {detectedFrequency && (
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            {detectedFrequency.toFixed(1)} Hz
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Tuning Accuracy */}
                                            {tuningAccuracy !== null && detectedString !== null && (
                                                <div className="bg-white p-4 rounded-lg shadow-inner">
                                                    <div className="text-center mb-3">
                                                        <div className="text-sm text-gray-600">
                                                            Closest to String {detectedString + 1} ({currentTuningData.tuning[5 - detectedString]})
                                                        </div>
                                                    </div>

                                                    {/* Tuning Meter */}
                                                    <div className="relative">
                                                        <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-yellow-500 to-red-500"></div>
                                                        </div>
                                                        {/* Needle */}
                                                        <div
                                                            className="absolute top-0 h-8 w-1 bg-black transform -translate-x-0.5 transition-all duration-100"
                                                            style={{
                                                                left: `${Math.max(0, Math.min(100, 50 + (tuningAccuracy / 50) * 25))}%`
                                                            }}
                                                        ></div>
                                                    </div>

                                                    <div className="text-center mt-2">
                                                        <div className={`text-lg font-bold ${Math.abs(tuningAccuracy) <= 5 ? 'text-green-600' :
                                                            Math.abs(tuningAccuracy) <= 15 ? 'text-yellow-600' :
                                                                'text-red-600'
                                                            }`}>
                                                            {tuningAccuracy > 0 ? '+' : ''}{tuningAccuracy} cents
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {Math.abs(tuningAccuracy) <= 5 ? '✅ In Tune!' :
                                                                tuningAccuracy > 5 ? '⬆️ Too High' : '⬇️ Too Low'}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                            </div>

                            {/* Tuning Tips */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#B0A0D0]">
                                <h3 className="text-xl font-semibold text-[#1A2A3A] mb-4">
                                    Tips Menyetel Gitar
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-6 h-6 bg-[#00FFFF] rounded-full flex items-center justify-center text-[#1A2A3A] font-bold text-sm">
                                                1
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-[#1A2A3A]">Mulai dari senar paling tebal</h4>
                                                <p className="text-sm text-gray-600">Setel senar 6 (E) terlebih dahulu, kemudian lanjut ke senar lainnya.</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <div className="w-6 h-6 bg-[#00FFFF] rounded-full flex items-center justify-center text-[#1A2A3A] font-bold text-sm">
                                                2
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-[#1A2A3A]">Setel secara bertahap</h4>
                                                <p className="text-sm text-gray-600">Jangan langsung menaikkan nada terlalu tinggi, lakukan secara perlahan.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-6 h-6 bg-[#00FFFF] rounded-full flex items-center justify-center text-[#1A2A3A] font-bold text-sm">
                                                3
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-[#1A2A3A]">Periksa kembali</h4>
                                                <p className="text-sm text-gray-600">Setelah semua senar disetel, periksa kembali dari awal.</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <div className="w-6 h-6 bg-[#00FFFF] rounded-full flex items-center justify-center text-[#1A2A3A] font-bold text-sm">
                                                4
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-[#1A2A3A]">Gunakan telinga</h4>
                                                <p className="text-sm text-gray-600">Selain menggunakan tuner, latih telinga untuk mendengar nada yang tepat.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Tuning Types */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#00FFFF] mb-8">
                                <h3 className="text-xl font-semibold text-[#1A2A3A] mb-4">Jenis Tuning</h3>
                                <div className="space-y-3">
                                    {Object.entries(guitarTunings).map(([key, tuning]) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                stopAllTones();
                                                setSelectedTuning(key);
                                            }}
                                            className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedTuning === key
                                                ? 'border-[#00FFFF] bg-[#E0E8EF] text-[#1A2A3A]'
                                                : 'border-gray-200 hover:border-[#00FFFF] hover:bg-gray-50 text-[#1A2A3A]'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-medium text-sm text-[#1A2A3A]">{tuning.name}</h4>
                                                <span className={`text-xs px-2 py-1 rounded-full ${tuning.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                                                    tuning.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {tuning.difficulty}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 mb-2">{tuning.description}</p>
                                            <div className="flex space-x-1">
                                                {tuning.tuning.map((note, index) => (
                                                    <span
                                                        key={index}
                                                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                                    >
                                                        {note}
                                                    </span>
                                                ))}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Reference */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#B0A0D0] mb-8">
                                <h3 className="text-lg font-semibold text-[#1A2A3A] mb-4">Referensi Cepat</h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <h4 className="font-medium text-[#1A2A3A] mb-1">Urutan Senar:</h4>
                                        <p className="text-gray-600">1 (paling tipis) → 6 (paling tebal)</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-[#1A2A3A] mb-1">Standard Tuning:</h4>
                                        <p className="text-gray-600">E-A-D-G-B-E (dari tebal ke tipis)</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-[#1A2A3A] mb-1">Metode Tuning:</h4>
                                        <ul className="text-gray-600 space-y-1">
                                            <li>• Elektronik (tuner)</li>
                                            <li>• Aplikasi mobile</li>
                                            <li>• Piano/keyboard</li>
                                            <li>• Tuning fork</li>
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
