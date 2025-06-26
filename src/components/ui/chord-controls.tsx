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
    const [transposeSteps, setTransposeSteps] = useState(0); // Track total semitone steps

    // Metronome state
    const [isMetronomeRunning, setIsMetronomeRunning] = useState(false);
    const [bpm, setBpm] = useState(parseInt(tempo) || 120);
    const [metronomeInterval, setMetronomeInterval] = useState<NodeJS.Timeout | null>(null);

    // Auto scroll functionality
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
    };    // Comprehensive chord transposition
    const transposeChord = (direction: 'up' | 'down') => {
        // All possible chord roots in chromatic order
        const chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const flatEquivalents = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        
        // Function to transpose a single chord
        const transposeSingleChord = (chord: string, semitones: number) => {
            if (!chord || chord.trim() === '') return chord;
            
            // Extract the root note (first 1-2 characters)
            let root = '';
            let suffix = '';
            
            if (chord.length >= 2 && (chord[1] === '#' || chord[1] === 'b')) {
                root = chord.substring(0, 2);
                suffix = chord.substring(2);
            } else {
                root = chord.substring(0, 1);
                suffix = chord.substring(1);
            }
            
            // Find current index in chromatic scale
            let currentIndex = chromaticScale.indexOf(root);
            if (currentIndex === -1) {
                currentIndex = flatEquivalents.indexOf(root);
            }
            
            if (currentIndex === -1) return chord; // Return unchanged if not found
            
            // Calculate new index
            let newIndex = (currentIndex + semitones + 12) % 12;
            const newRoot = chromaticScale[newIndex];
            
            return newRoot + suffix;
        };
        
        // Calculate semitone change
        const semitones = direction === 'up' ? 1 : -1;
          // Update the transpose key display and track steps
        const newTransposeKey = transposeSingleChord(transposeKey, semitones);
        const newSteps = transposeSteps + semitones;
        setTransposeKey(newTransposeKey);
        setTransposeSteps(newSteps);
        
        // Find and transpose all chords in the page content
        const chordElements = document.querySelectorAll('[data-chord], .chord, .chord-symbol');
        
        chordElements.forEach((element) => {
            const originalText = element.textContent || '';
            const chordRegex = /\b([A-G][#b]?(?:maj|min|m|M|sus|aug|dim|add|\d)*(?:\/[A-G][#b]?)?)\b/g;
            
            const transposedText = originalText.replace(chordRegex, (match) => {
                return transposeSingleChord(match, semitones);
            });
            
            if (element.textContent !== transposedText) {
                element.textContent = transposedText;
            }
        });
        
        // Also update any chord content with class 'chord-content'
        const chordContent = document.querySelector('.chord-content');
        if (chordContent) {            const walker = document.createTreeWalker(
                chordContent,
                NodeFilter.SHOW_TEXT
            );
            
            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }
            
            textNodes.forEach((textNode) => {
                const originalText = textNode.textContent || '';
                const chordRegex = /\b([A-G][#b]?(?:maj|min|m|M|sus|aug|dim|add|\d)*(?:\/[A-G][#b]?)?)\b/g;
                
                const transposedText = originalText.replace(chordRegex, (match) => {
                    return transposeSingleChord(match, semitones);
                });
                
                if (textNode.textContent !== transposedText) {
                    textNode.textContent = transposedText;
                }
            });
        }
          // Dispatch custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('chordTransposed', {
            detail: {
                direction,
                semitones,
                newKey: newTransposeKey,
                originalKey: transposeKey,
                totalSteps: newSteps
            }
        }));
    };

    // Reset transpose to original key
    const resetTranspose = () => {
        if (transposeSteps === 0) return; // Already at original
        
        // Calculate how many semitones to go back to original
        const resetSemitones = -transposeSteps;
        
        // Reset all chords in the page content
        const chordElements = document.querySelectorAll('[data-chord], .chord, .chord-symbol');
        
        chordElements.forEach((element) => {
            const originalText = element.textContent || '';
            const chordRegex = /\b([A-G][#b]?(?:maj|min|m|M|sus|aug|dim|add|\d)*(?:\/[A-G][#b]?)?)\b/g;
            
            const transposedText = originalText.replace(chordRegex, (match) => {
                return transposeSingleChord(match, resetSemitones);
            });
            
            if (element.textContent !== transposedText) {
                element.textContent = transposedText;
            }
        });
        
        // Also reset chord content
        const chordContent = document.querySelector('.chord-content');
        if (chordContent) {
            const walker = document.createTreeWalker(
                chordContent,
                NodeFilter.SHOW_TEXT
            );
            
            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }
            
            textNodes.forEach((textNode) => {
                const originalText = textNode.textContent || '';
                const chordRegex = /\b([A-G][#b]?(?:maj|min|m|M|sus|aug|dim|add|\d)*(?:\/[A-G][#b]?)?)\b/g;
                
                const transposedText = originalText.replace(chordRegex, (match) => {
                    return transposeSingleChord(match, resetSemitones);
                });
                
                if (textNode.textContent !== transposedText) {
                    textNode.textContent = transposedText;
                }
            });
        }
        
        // Reset state
        setTransposeKey(currentKey);
        setTransposeSteps(0);
        
        // Dispatch reset event
        window.dispatchEvent(new CustomEvent('chordReset', {
            detail: {
                originalKey: currentKey,
                resetSteps: resetSemitones
            }
        }));
    };

    // Helper function for transposing individual chords (moved here for reuse)
    const transposeSingleChord = (chord: string, semitones: number) => {
        if (!chord || chord.trim() === '') return chord;
        
        const chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const flatEquivalents = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        
        // Extract the root note (first 1-2 characters)
        let root = '';
        let suffix = '';
        
        if (chord.length >= 2 && (chord[1] === '#' || chord[1] === 'b')) {
            root = chord.substring(0, 2);
            suffix = chord.substring(2);
        } else {
            root = chord.substring(0, 1);
            suffix = chord.substring(1);
        }
        
        // Find current index in chromatic scale
        let currentIndex = chromaticScale.indexOf(root);
        if (currentIndex === -1) {
            currentIndex = flatEquivalents.indexOf(root);
        }
        
        if (currentIndex === -1) return chord; // Return unchanged if not found
        
        // Calculate new index
        let newIndex = (currentIndex + semitones + 12) % 12;
        const newRoot = chromaticScale[newIndex];
        
        return newRoot + suffix;
    };const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Desktop Layout - Compact floating controls */}
            <div className="hidden lg:block fixed bottom-4 right-4 z-50">
                <div className="flex flex-col items-end">
                    {/* Control Panels - More Compact */}
                    <div className={`flex flex-col space-y-1.5 mb-2 transition-all duration-300 ${
                        isOpen ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-6 pointer-events-none'
                    }`}>
                        {/* Auto Scroll & Metronome Combined Panel */}
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border-l-4 border-[#00FFFF] w-44">
                            <div className="space-y-3">
                                {/* Auto Scroll Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-[#1A2A3A] flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                                            </svg>
                                            Scroll
                                        </span>
                                        <button
                                            onClick={toggleAutoScroll}
                                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                                isAutoScrolling
                                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                                    : 'bg-[#00FFFF] text-[#1A2A3A] hover:bg-[#B0A0D0]'
                                            }`}
                                        >
                                            {isAutoScrolling ? 'Stop' : 'Start'}
                                        </button>
                                    </div>
                                    {isAutoScrolling && (
                                        <div className="flex space-x-1">
                                            {[1, 2, 3, 4].map((speed) => (
                                                <button
                                                    key={speed}
                                                    onClick={() => adjustScrollSpeed(speed)}
                                                    className={`flex-1 py-1 px-1 rounded text-xs ${
                                                        scrollSpeed === speed
                                                            ? 'bg-[#1A2A3A] text-white'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    }`}
                                                >
                                                    {speed}x
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200"></div>

                                {/* Metronome Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-[#1A2A3A] flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 001 1h3a1 1 0 110 2h-3a1 1 0 00-1 1v3a1 1 0 11-2 0V8a1 1 0 00-1-1H5a1 1 0 110-2h3a1 1 0 001-1V3a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                            {bpm} BPM
                                        </span>
                                        <button
                                            onClick={toggleMetronome}
                                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                                isMetronomeRunning
                                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                                    : 'bg-[#00FFFF] text-[#1A2A3A] hover:bg-[#B0A0D0]'
                                            }`}
                                        >
                                            {isMetronomeRunning ? '⏸' : '▶'} {isMetronomeRunning && '♪'}
                                        </button>
                                    </div>
                                    <div className="flex space-x-1">
                                        <button
                                            onClick={() => adjustBpm(bpm - 10)}
                                            className="flex-1 py-1 px-1 rounded text-xs bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        >
                                            -10
                                        </button>
                                        <button
                                            onClick={() => adjustBpm(bpm - 1)}
                                            className="flex-1 py-1 px-1 rounded text-xs bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        >
                                            -1
                                        </button>
                                        <button
                                            onClick={() => adjustBpm(bpm + 1)}
                                            className="flex-1 py-1 px-1 rounded text-xs bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        >
                                            +1
                                        </button>
                                        <button
                                            onClick={() => adjustBpm(bpm + 10)}
                                            className="flex-1 py-1 px-1 rounded text-xs bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        >
                                            +10
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transpose & Font Size Combined Panel */}
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border-l-4 border-[#B0A0D0] w-44">
                            <div className="space-y-3">
                                {/* Transpose Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-[#1A2A3A] flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                                            </svg>
                                            {transposeKey}
                                        </span>
                                        <button
                                            onClick={() => setTransposeKey(currentKey)}
                                            className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                    <div className="flex space-x-1">
                                        <button
                                            onClick={() => transposeChord('down')}
                                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded text-xs font-medium transition-colors"
                                        >
                                            ♭
                                        </button>
                                        <button
                                            onClick={() => transposeChord('up')}
                                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded text-xs font-medium transition-colors"
                                        >
                                            ♯
                                        </button>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200"></div>

                                {/* Font Size Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-[#1A2A3A] flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                            Font
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-1">
                                        {[
                                            { size: 'small', label: 'S' },
                                            { size: 'medium', label: 'M' },
                                            { size: 'large', label: 'L' },
                                            { size: 'xl', label: 'XL' }
                                        ].map(({ size, label }) => (
                                            <button
                                                key={size}
                                                onClick={() => changeFontSize(size)}
                                                className={`py-1 px-1 rounded text-xs font-medium transition-colors ${
                                                    fontSize === size
                                                        ? 'bg-[#B0A0D0] text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Toggle Button - Smaller */}
                    <button
                        onClick={toggleMenu}
                        className={`w-12 h-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center ${
                            isOpen ? 'bg-[#00FFFF] text-[#1A2A3A]' : 'bg-[#1A2A3A] text-white'
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
                </div>
            </div>            {/* Mobile/Tablet Layout - Compact bottom sheet */}
            <div className="lg:hidden">
                {/* Mobile Toggle Button - Smaller */}
                <button
                    onClick={toggleMenu}
                    className={`fixed bottom-4 right-4 w-11 h-11 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center ${
                        isOpen ? 'bg-[#00FFFF] text-[#1A2A3A]' : 'bg-[#1A2A3A] text-white'
                    }`}
                    title={isOpen ? "Close controls" : "Open chord controls"}
                >
                    <svg
                        className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* Compact Mobile Bottom Sheet */}
                <div className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm rounded-t-xl shadow-2xl border-t-4 border-[#00FFFF] transition-transform duration-300 ${
                    isOpen ? 'transform translate-y-0' : 'transform translate-y-full'
                }`}>
                    {/* Handle bar */}
                    <div className="flex justify-center py-2">
                        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                    </div>

                    {/* Compact content */}
                    <div className="px-3 pb-4 max-h-[60vh] overflow-y-auto">
                        {/* Quick Controls Row */}
                        <div className="flex justify-between items-center mb-3 p-2 bg-gray-50 rounded-lg">
                            <div className="flex space-x-2">
                                <button
                                    onClick={toggleAutoScroll}
                                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                                        isAutoScrolling
                                            ? 'bg-red-500 text-white'
                                            : 'bg-[#00FFFF] text-[#1A2A3A]'
                                    }`}
                                >
                                    {isAutoScrolling ? 'Stop Scroll' : 'Scroll'}
                                </button>
                                <button
                                    onClick={toggleMetronome}
                                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                                        isMetronomeRunning
                                            ? 'bg-red-500 text-white'
                                            : 'bg-[#00FFFF] text-[#1A2A3A]'
                                    }`}
                                >
                                    {isMetronomeRunning ? '⏸' : '▶'} {bpm}
                                </button>
                            </div>
                            <div className="flex space-x-1">
                                <span className="text-xs font-semibold text-[#1A2A3A]">{transposeKey}</span>
                                <button
                                    onClick={() => transposeChord('down')}
                                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs"
                                >
                                    ♭
                                </button>
                                <button
                                    onClick={() => transposeChord('up')}
                                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs"
                                >
                                    ♯
                                </button>
                            </div>
                        </div>

                        {/* Expandable Controls */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Auto Scroll Details */}
                            {isAutoScrolling && (
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-600 font-medium">Scroll Speed:</label>
                                    <div className="grid grid-cols-4 gap-1">
                                        {[1, 2, 3, 4].map((speed) => (
                                            <button
                                                key={speed}
                                                onClick={() => adjustScrollSpeed(speed)}
                                                className={`py-1 rounded text-xs ${
                                                    scrollSpeed === speed
                                                        ? 'bg-[#1A2A3A] text-white'
                                                        : 'bg-gray-200 text-gray-700'
                                                }`}
                                            >
                                                {speed}x
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Metronome BPM Controls */}
                            <div className="space-y-2">
                                <label className="text-xs text-gray-600 font-medium">BPM Control:</label>
                                <div className="grid grid-cols-4 gap-1">
                                    <button
                                        onClick={() => adjustBpm(bpm - 10)}
                                        className="py-1 px-1 rounded text-xs bg-gray-200 text-gray-700"
                                    >
                                        -10
                                    </button>
                                    <button
                                        onClick={() => adjustBpm(bpm - 1)}
                                        className="py-1 px-1 rounded text-xs bg-gray-200 text-gray-700"
                                    >
                                        -1
                                    </button>
                                    <button
                                        onClick={() => adjustBpm(bpm + 1)}
                                        className="py-1 px-1 rounded text-xs bg-gray-200 text-gray-700"
                                    >
                                        +1
                                    </button>
                                    <button
                                        onClick={() => adjustBpm(bpm + 10)}
                                        className="py-1 px-1 rounded text-xs bg-gray-200 text-gray-700"
                                    >
                                        +10
                                    </button>
                                </div>
                            </div>

                            {/* Font Size */}
                            <div className="space-y-2">
                                <label className="text-xs text-gray-600 font-medium">Font Size:</label>
                                <div className="grid grid-cols-4 gap-1">
                                    {[
                                        { size: 'small', label: 'S' },
                                        { size: 'medium', label: 'M' },
                                        { size: 'large', label: 'L' },
                                        { size: 'xl', label: 'XL' }
                                    ].map(({ size, label }) => (
                                        <button
                                            key={size}
                                            onClick={() => changeFontSize(size)}
                                            className={`py-1 rounded text-xs font-medium ${
                                                fontSize === size
                                                    ? 'bg-[#B0A0D0] text-white'
                                                    : 'bg-gray-200 text-gray-700'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Reset Controls */}
                            <div className="space-y-2">
                                <label className="text-xs text-gray-600 font-medium">Reset:</label>
                                <div className="space-y-1">
                                    <button
                                        onClick={resetBpm}
                                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 rounded text-xs"
                                    >
                                        Reset BPM
                                    </button>
                                    <button
                                        onClick={() => setTransposeKey(currentKey)}
                                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 rounded text-xs"
                                    >
                                        Reset Key
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>{/* Mobile Backdrop - Transparent */}
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
