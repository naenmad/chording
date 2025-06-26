'use client';

import { useState } from 'react';

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
  className?: string;
}

export default function ShareButton({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'Chording!',
  text = 'Lihat chord lagu ini di Chording!',
  className = ""
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy URL: ', err);
    }
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank');
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className={`inline-flex items-center space-x-2 px-4 py-2 bg-[#B0A0D0] text-white rounded-md hover:bg-[#00FFFF] hover:text-[#1A2A3A] transition-all duration-300 ${className}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
        <span>Bagikan</span>
      </button>

      {/* Custom share menu for browsers without native share */}
      {isOpen && !navigator.share && (
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <button
            onClick={copyToClipboard}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
          </button>

          <button
            onClick={shareToWhatsApp}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
          >
            <span className="text-green-500">💬</span>
            <span>WhatsApp</span>
          </button>

          <button
            onClick={shareToTelegram}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
          >
            <span className="text-blue-500">✈️</span>
            <span>Telegram</span>
          </button>

          <button
            onClick={shareToTwitter}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
          >
            <span className="text-blue-400">🐦</span>
            <span>Twitter</span>
          </button>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
