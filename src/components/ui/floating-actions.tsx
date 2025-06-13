'use client';

import { useState } from 'react';

interface FloatingActionsProps {
    chordTitle: string;
    chordArtist: string;
}

const FloatingActions = ({ chordTitle, chordArtist }: FloatingActionsProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleLike = () => setIsLiked(!isLiked);
    const toggleSave = () => setIsSaved(!isSaved);

    const shareChord = () => {
        if (navigator.share) {
            navigator.share({
                title: `${chordTitle} - ${chordArtist}`,
                text: `Check out this chord: ${chordTitle} by ${chordArtist}`,
                url: window.location.href,
            });
        } else {
            // Fallback to copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const downloadPDF = () => {
        // Placeholder for PDF download functionality
        alert('Download PDF feature coming soon!');
    };

    const openComments = () => {
        // Placeholder for comments modal/panel
        alert('Comments feature coming soon!');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Floating Action Buttons */}
            <div className={`flex flex-col items-end space-y-3 transition-all duration-300 ${isOpen ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4 pointer-events-none'}`}>

                {/* Like Button */}
                <button
                    onClick={toggleLike}
                    className={`p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${isLiked
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-600 hover:text-red-500'
                        }`}
                    title="Like this chord"
                >
                    <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                {/* Save Button */}
                <button
                    onClick={toggleSave}
                    className={`p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${isSaved
                        ? 'bg-[#00FFFF] text-[#1A2A3A]'
                        : 'bg-white text-gray-600 hover:text-[#00FFFF]'
                        }`}
                    title="Save to favorites"
                >
                    <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </button>

                {/* Share Button */}
                <button
                    onClick={shareChord}
                    className="bg-white text-gray-600 hover:text-blue-500 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                    title="Share this chord"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                </button>

                {/* Download PDF Button */}
                <button
                    onClick={downloadPDF}
                    className="bg-white text-gray-600 hover:text-green-500 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                    title="Download as PDF"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </button>

                {/* Comments Button */}
                <button
                    onClick={openComments}
                    className="bg-white text-gray-600 hover:text-purple-500 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                    title="View comments"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            </div>

            {/* Main Toggle Button */}
            <button
                onClick={toggleMenu}
                className={`bg-[#00FFFF] text-[#1A2A3A] p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${isOpen ? 'rotate-45' : ''
                    }`}
                title={isOpen ? "Close menu" : "Open actions menu"}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-20 -z-10 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default FloatingActions;
