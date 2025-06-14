'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality here
    console.log('Searching for:', searchQuery);
    // You would typically redirect to search results page
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#1A2A3A] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand name */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-white group-hover:text-[#00FFFF] transition-colors">
                Chording!
                <span className="text-[#00FFFF]">.</span>
              </span>
            </Link>
          </div>          {/* Search bar */}
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Cari judul lagu atau artis..."
                className="w-full py-2 pl-4 pr-12 rounded-md border-0 bg-[#2A3A4A] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-3 flex items-center bg-[#00FFFF] text-[#1A2A3A] font-medium rounded-r-md hover:bg-[#B0A0D0] transition-colors"
              >
                {/* Show text on desktop, icon on mobile */}
                <span className="hidden sm:block">Search</span>
                <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>              </button>
            </form>
          </div>          {/* Navigation items */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-[#00FFFF] font-medium transition-colors">Beranda</Link>
            <Link href="/genre" className="text-white hover:text-[#00FFFF] font-medium transition-colors">Genre</Link>
            <Link href="/artists" className="text-white hover:text-[#00FFFF] font-medium transition-colors">Artis</Link>
            <Link href="/popular" className="text-white hover:text-[#00FFFF] font-medium transition-colors">Terpopuler</Link>
            <Link href="/about" className="text-white hover:text-[#00FFFF] font-medium transition-colors">Tentang</Link>
            <Link href="/login" className="bg-[#00FFFF] text-[#1A2A3A] px-4 py-2 rounded-lg font-medium hover:bg-[#B0A0D0] transition-colors">Login</Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="outline-none mobile-menu-button"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-white hover:text-[#00FFFF]"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <ul className="px-4 pt-2 pb-3 space-y-1 sm:px-3 bg-[#1A2A3A] border-t border-[#2A3A4A]">
            <li>
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#2A3A4A] hover:text-[#00FFFF]">Beranda</Link>
            </li>
            <li>
              <Link href="/genre" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#2A3A4A] hover:text-[#00FFFF]">Genre</Link>
            </li>
            <li>
              <Link href="/artists" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#2A3A4A] hover:text-[#00FFFF]">Artis</Link>
            </li>
            <li>
              <Link href="/popular" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#2A3A4A] hover:text-[#00FFFF]">Terpopuler</Link>
            </li>            <li>
              <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#2A3A4A] hover:text-[#00FFFF]">Tentang</Link>
            </li>
            <li className="pt-2 border-t border-[#2A3A4A]">
              <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium bg-[#00FFFF] text-[#1A2A3A] hover:bg-[#B0A0D0] text-center">Login</Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
