'use client';

import { useState, useEffect } from 'react';

interface ChordControlsProps {
    currentKey?: string;
    tempo?: string; // Added tempo prop for metronome
}

const ChordControls = ({ currentKey = "Am", tempo = "120 BPM" }: ChordControlsProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAutoScrolling, setIsAutoScrolling] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(2);
    const [fontSize, setFontSize] = useState('medium');
    const [transposeKey, setTransposeKey] = useState(currentKey);

    // Metronome state
    const [isMetronomeRunning, setIsMetronomeRunning] = useState(false);
    const [bpm, setBpm] = useState(parseInt(tempo) || 120);
    const [metronomeInterval, setMetronomeInterval] = useState<NodeJS.Timeout | null>(null);    // Auto scroll functionality
    useEffect(() => {
        let scrollInterval: NodeJS.Timeout;

        if (isAutoScrolling) {
            scrollInterval = setInterval(() => {
                window.scrollBy(0, scrollSpeed);
            }, 100);
        }

        return () => {
            if (scrollInterval) {
                clearInterval(scrollInterval);
            }
        };
    }, [isAutoScrolling, scrollSpeed]);

    // Metronome functionality
    useEffect(() => {
        if (isMetronomeRunning) {
            const interval = 60000 / bpm; // Convert BPM to milliseconds
            const metInterval = setInterval(() => {
                // Create click sound
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 800;
                oscillator.type = 'square';

                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            }, interval);

            setMetronomeInterval(metInterval);
        } else {
            if (metronomeInterval) {
                clearInterval(metronomeInterval);
                setMetronomeInterval(null);
            }
        }

        return () => {
            if (metronomeInterval) {
                clearInterval(metronomeInterval);
            }
        };
    }, [isMetronomeRunning, bpm]); const toggleAutoScroll = () => {
        setIsAutoScrolling(!isAutoScrolling);
    };

    const adjustScrollSpeed = (speed: number) => {
        setScrollSpeed(speed);
    };

    // Metronome functions
    const toggleMetronome = () => {
        setIsMetronomeRunning(!isMetronomeRunning);
    };

    const adjustBpm = (newBpm: number) => {
        setBpm(Math.max(40, Math.min(200, newBpm))); // Limit BPM between 40-200
    };

    const resetBpm = () => {
        setBpm(parseInt(tempo) || 120);
    };

    const changeFontSize = (size: string) => {
        setFontSize(size);
        // Apply font size to chord content
        const chordContent = document.querySelector('.chord-content');
        if (chordContent) {
            chordContent.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
            switch (size) {
                case 'small':
                    chordContent.classList.add('text-sm');
                    break;
                case 'medium':
                    chordContent.classList.add('text-base');
                    break;
                case 'large':
                    chordContent.classList.add('text-lg');
                    break;
                case 'xl':
                    chordContent.classList.add('text-xl');
                    break;
            }
        }
    };

    const transposeChord = (direction: 'up' | 'down') => {
        // Simple chord progression for demo
        const chordProgression = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const minorProgression = ['Am', 'A#m', 'Bm', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m'];

        let currentIndex;
        let isMinor = transposeKey.includes('m');
        let progression = isMinor ? minorProgression : chordProgression;

        currentIndex = progression.indexOf(transposeKey);

        if (currentIndex !== -1) {
            let newIndex;
            if (direction === 'up') {
                newIndex = (currentIndex + 1) % progression.length;
            } else {
                newIndex = currentIndex === 0 ? progression.length - 1 : currentIndex - 1;
            }
            const newKey = progression[newIndex];
            setTransposeKey(newKey);
        }
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Desktop Layout - Floating controls in bottom right */}
            <div className="hidden lg:block fixed bottom-6 right-6 z-50">
                <div className="flex flex-col items-end">
                    {/* Control Panels */}
                    <div className={`flex flex-col space-y-3 mb-4 transition-all duration-300 ${isOpen ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8 pointer-events-none'
                        }`}>
                        {/* Auto Scroll Panel */}
                        <div className="bg-white rounded-lg shadow-lg p-4 border-t-4 border-[#00FFFF] w-48">
                            <h4 className="text-sm font-semibold text-[#1A2A3A] mb-3 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                                </svg>
                                Auto Scroll
                            </h4>
                            <div className="space-y-2">
                                <button
                                    onClick={toggleAutoScroll}
                                    className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${isAutoScrolling
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-[#00FFFF] text-[#1A2A3A] hover:bg-[#B0A0D0]'
                                        }`}
                                >
                                    {isAutoScrolling ? 'Stop Scroll' : 'Start Scroll'}
                                </button>
                                {isAutoScrolling && (
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-600">Speed:</label>
                                        <div className="flex space-x-1">
                                            {[1, 2, 3, 4].map((speed) => (
                                                <button
                                                    key={speed}
                                                    onClick={() => adjustScrollSpeed(speed)}
                                                    className={`flex-1 py-1 px-2 rounded text-xs ${scrollSpeed === speed
                                                        ? 'bg-[#1A2A3A] text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                >
                                                    {speed}x
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>                        </div>

                        {/* Metronome Panel */}
                        <div className="bg-white rounded-lg shadow-lg p-4 border-t-4 border-[#00FFFF] w-48">
                            <h4 className="text-sm font-semibold text-[#1A2A3A] mb-3 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 001 1h3a1 1 0 110 2h-3a1 1 0 00-1 1v3a1 1 0 11-2 0V8a1 1 0 00-1-1H5a1 1 0 110-2h3a1 1 0 001-1V3a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Metronome
                            </h4>
                            <div className="space-y-2">
                                <div className="text-center">
                                    <span className="text-lg font-bold text-[#00FFFF]">{bpm} BPM</span>
                                </div>
                                <button
                                    onClick={toggleMetronome}
                                    className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${isMetronomeRunning
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-[#00FFFF] text-[#1A2A3A] hover:bg-[#B0A0D0]'
                                        }`}
                                >
                                    {isMetronomeRunning ? 'Stop' : 'Start'} {isMetronomeRunning && '♪'}
                                </button>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-600">Adjust BPM:</label>
                                    <div className="flex space-x-1">
                                        <button
                                            onClick={() => adjustBpm(bpm - 10)}
                                            className="flex-1 py-1 px-2 rounded text-xs bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        >
                                            -10
                                        </button>
                                        <button
                                            onClick={() => adjustBpm(bpm - 1)}
                                            className="flex-1 py-1 px-2 rounded text-xs bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        >
                                            -1
                                        </button>
                                        <button
                                            onClick={() => adjustBpm(bpm + 1)}
                                            className="flex-1 py-1 px-2 rounded text-xs bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        >
                                            +1
                                        </button>
                                        <button
                                            onClick={() => adjustBpm(bpm + 10)}
                                            className="flex-1 py-1 px-2 rounded text-xs bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        >
                                            +10
                                        </button>
                                    </div>
                                    <button
                                        onClick={resetBpm}
                                        className="w-full bg-[#1A2A3A] hover:bg-[#2A3A4A] text-white py-1 px-3 rounded text-xs transition-colors"
                                    >
                                        Reset to Original
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Transpose Panel */}
                        <div className="bg-white rounded-lg shadow-lg p-4 border-t-4 border-[#00FFFF] w-48">
                            <h4 className="text-sm font-semibold text-[#1A2A3A] mb-3 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                                </svg>
                                Transpose
                            </h4>
                            <div className="space-y-2">
                                <div className="text-center">
                                    <span className="text-lg font-bold text-[#00FFFF]">{transposeKey}</span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => transposeChord('down')}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded text-sm font-medium transition-colors"
                                    >
                                        ♭ Down
                                    </button>
                                    <button
                                        onClick={() => transposeChord('up')}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded text-sm font-medium transition-colors"
                                    >
                                        ♯ Up
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        setTransposeKey(currentKey);
                                    }}
                                    className="w-full bg-[#1A2A3A] hover:bg-[#2A3A4A] text-white py-1 px-3 rounded text-xs transition-colors"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                        {/* Font Size Panel */}
                        <div className="bg-white rounded-lg shadow-lg p-4 border-t-4 border-[#00FFFF] w-48">
                            <h4 className="text-sm font-semibold text-[#1A2A3A] mb-3 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Font Size
                            </h4>
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { size: 'small', label: 'Small', class: 'text-xs' },
                                        { size: 'medium', label: 'Medium', class: 'text-sm' },
                                        { size: 'large', label: 'Large', class: 'text-base' },
                                        { size: 'xl', label: 'XL', class: 'text-lg' }
                                    ].map(({ size, label, class: textClass }) => (
                                        <button
                                            key={size}
                                            onClick={() => changeFontSize(size)}
                                            className={`py-2 px-3 rounded text-sm font-medium transition-colors ${fontSize === size
                                                ? 'bg-[#00FFFF] text-[#1A2A3A]'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                        >
                                            <span className={textClass}>A</span> {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Toggle Button */}
                    <button
                        onClick={toggleMenu}
                        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center ${isOpen ? 'bg-[#00FFFF] text-[#1A2A3A]' : 'bg-[#1A2A3A] text-white'
                            }`}
                        title={isOpen ? "Close controls" : "Open chord controls"}
                    >
                        <svg
                            className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile/Tablet Layout - Bottom sheet style */}
            <div className="lg:hidden">
                {/* Mobile Toggle Button - Fixed bottom right */}
                <button
                    onClick={toggleMenu}
                    className={`fixed bottom-4 right-4 w-12 h-12 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center ${isOpen ? 'bg-[#00FFFF] text-[#1A2A3A]' : 'bg-[#1A2A3A] text-white'
                        }`}
                    title={isOpen ? "Close controls" : "Open chord controls"}
                >
                    <svg
                        className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* Mobile Bottom Sheet */}
                <div className={`fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-xl shadow-2xl border-t-4 border-[#00FFFF] transition-transform duration-300 ${isOpen ? 'transform translate-y-0' : 'transform translate-y-full'
                    }`}>
                    {/* Handle bar */}
                    <div className="flex justify-center py-2">
                        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                    </div>

                    {/* Bottom sheet content */}
                    <div className="px-4 pb-6 max-h-[70vh] overflow-y-auto">                        {/* Control sections in horizontal layout */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Auto Scroll Section */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-[#1A2A3A] flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                                    </svg>
                                    Auto Scroll
                                </h4>
                                <button
                                    onClick={toggleAutoScroll}
                                    className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${isAutoScrolling
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-[#00FFFF] text-[#1A2A3A] hover:bg-[#B0A0D0]'
                                        }`}
                                >
                                    {isAutoScrolling ? 'Stop Scroll' : 'Start Scroll'}
                                </button>
                                {isAutoScrolling && (
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-600">Speed:</label>
                                        <div className="grid grid-cols-4 gap-1">
                                            {[1, 2, 3, 4].map((speed) => (
                                                <button
                                                    key={speed}
                                                    onClick={() => adjustScrollSpeed(speed)}
                                                    className={`py-1 px-2 rounded text-xs ${scrollSpeed === speed
                                                        ? 'bg-[#1A2A3A] text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                >
                                                    {speed}x
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Metronome Section */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-[#1A2A3A] flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 001 1h3a1 1 0 110 2h-3a1 1 0 00-1 1v3a1 1 0 11-2 0V8a1 1 0 00-1-1H5a1 1 0 110-2h3a1 1 0 001-1V3a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Metronome
                                </h4>
                                <div className="text-center">
                                    <span className="text-lg font-bold text-[#00FFFF]">{bpm} BPM</span>
                                </div>
                                <button
                                    onClick={toggleMetronome}
                                    className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${isMetronomeRunning
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-[#00FFFF] text-[#1A2A3A] hover:bg-[#B0A0D0]'
                                        }`}
                                >
                                    {isMetronomeRunning ? 'Stop' : 'Start'} {isMetronomeRunning && '♪'}
                                </button>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-600">Adjust BPM:</label>
                                    <div className="grid grid-cols-4 gap-1">
                                        <button
                                            onClick={() => adjustBpm(bpm - 10)}
                                            className="py-1 px-2 rounded text-xs bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        >
                                            -10
                                        </button>
                                        <button
                                            onClick={() => adjustBpm(bpm - 1)}
                                            className="py-1 px-2 rounded text-xs bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        >
                                            -1
                                        </button>
                                        <button
                                            onClick={() => adjustBpm(bpm + 1)}
                                            className="py-1 px-2 rounded text-xs bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        >
                                            +1
                                        </button>
                                        <button
                                            onClick={() => adjustBpm(bpm + 10)}
                                            className="py-1 px-2 rounded text-xs bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        >
                                            +10
                                        </button>
                                    </div>
                                    <button
                                        onClick={resetBpm}
                                        className="w-full bg-[#1A2A3A] hover:bg-[#2A3A4A] text-white py-1 px-3 rounded text-xs transition-colors"
                                    >
                                        Reset to Original
                                    </button>
                                </div>
                            </div>

                            {/* Transpose Section */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-[#1A2A3A] flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                                    </svg>
                                    Transpose
                                </h4>
                                <div className="text-center">
                                    <span className="text-lg font-bold text-[#00FFFF]">{transposeKey}</span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => transposeChord('down')}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded text-sm font-medium transition-colors"
                                    >
                                        ♭ Down
                                    </button>
                                    <button
                                        onClick={() => transposeChord('up')}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded text-sm font-medium transition-colors"
                                    >
                                        ♯ Up
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        setTransposeKey(currentKey);
                                    }}
                                    className="w-full bg-[#1A2A3A] hover:bg-[#2A3A4A] text-white py-1 px-3 rounded text-xs transition-colors"
                                >
                                    Reset
                                </button>
                            </div>

                            {/* Font Size Section */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-[#1A2A3A] flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Font Size
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { size: 'small', label: 'S', class: 'text-xs' },
                                        { size: 'medium', label: 'M', class: 'text-sm' },
                                        { size: 'large', label: 'L', class: 'text-base' },
                                        { size: 'xl', label: 'XL', class: 'text-lg' }
                                    ].map(({ size, label, class: textClass }) => (
                                        <button
                                            key={size}
                                            onClick={() => changeFontSize(size)}
                                            className={`py-2 px-3 rounded text-sm font-medium transition-colors ${fontSize === size
                                                ? 'bg-[#00FFFF] text-[#1A2A3A]'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                        >
                                            <span className={textClass}>A</span> {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                {/* Mobile Backdrop - Transparent */}
                {isOpen && (
                    <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </div>
        </>
    );
};

export default ChordControls;
