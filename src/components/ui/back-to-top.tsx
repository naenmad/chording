'use client';

import { useState, useEffect } from 'react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Use scrollY instead of pageYOffset for better browser support
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
    >
      <button
        onClick={scrollToTop}
        className="flex items-center justify-center w-12 h-12 bg-[#1A2A3A] text-white rounded-full shadow-lg hover:bg-[#00FFFF] hover:text-[#1A2A3A] transition-all duration-300 hover:scale-110 group border-2 border-[#00FFFF]/20 hover:border-[#00FFFF]"
        aria-label="Kembali ke atas"
        title="Kembali ke atas"
      >
        <svg
          className="w-5 h-5 transform group-hover:-translate-y-0.5 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </div>
  );
}
