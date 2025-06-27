'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { authAPI } from '@/lib/supabase';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isAdmin, loading } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to search page with query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await authAPI.signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getAvatarUrl = () => {
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }

    const email = user?.email || '';
    const name = user?.user_metadata?.full_name || user?.user_metadata?.name || email;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=32&background=00FFFF&color=1A2A3A`;
  };

  const getDisplayName = () => {
    return user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split('@')[0] ||
      'User';
  };

  // Show loading state until component is mounted
  if (!mounted) {
    return (
      <nav className="bg-gradient-to-r from-[#1A2A3A] to-[#2A3A4A] shadow-xl sticky top-0 z-50 border-b border-[#00FFFF]/20">
        <div className="w-full px-4 lg:px-6">
          <div className="flex items-center h-16">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <span className="text-2xl lg:text-3xl font-bold text-white">
                  Chording!
                  <span className="text-[#00FFFF]">.</span>
                </span>
              </div>
            </div>
            <div className="flex-1"></div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#2A3A4A] to-[#3A4A5A] rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  } return (
    <nav className="bg-gradient-to-r from-[#1A2A3A] to-[#2A3A4A] shadow-xl sticky top-0 z-50 border-b border-[#00FFFF]/20">
      <div className="w-full px-4 lg:px-6">
        <div className="flex items-center h-16">
          {/* Logo / Brand name - Far Left */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <span className="text-2xl lg:text-3xl font-bold text-white group-hover:text-[#00FFFF] transition-all duration-300 drop-shadow-lg">
                  Chording!
                  <span className="text-[#00FFFF] animate-pulse">.</span>
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00FFFF] to-[#B0A0D0] group-hover:w-full transition-all duration-300"></div>
              </div>
            </Link>
          </div>

          {/* Center Section - Navigation Links and Search */}
          <div className="hidden lg:flex items-center flex-1 justify-between px-4">
            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-[#00FFFF] font-medium transition-all duration-200 relative group px-2 py-1">
                Beranda
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-[#00FFFF] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
              <Link href="/genre" className="text-white hover:text-[#00FFFF] font-medium transition-all duration-200 relative group px-2 py-1">
                Genre
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-[#00FFFF] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
              <Link href="/artists" className="text-white hover:text-[#00FFFF] font-medium transition-all duration-200 relative group px-2 py-1">
                Artis
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-[#00FFFF] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
              <Link href="/popular" className="text-white hover:text-[#00FFFF] font-medium transition-all duration-200 relative group px-2 py-1">
                Terpopuler
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-[#00FFFF] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
            </div>

            {/* Music Tools - Compact */}
            <div className="flex items-center space-x-3 px-3 py-1.5 bg-gradient-to-r from-[#00FFFF]/10 to-[#B0A0D0]/10 rounded-lg border border-[#00FFFF]/20">
              <Link href="/tuning" className="group text-white hover:text-[#00FFFF] font-medium transition-all duration-200 relative px-1 py-1 flex items-center space-x-1">
                <span className="text-sm">🎸</span>
                <span className="text-sm">Tuner</span>
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-[#00FFFF] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
              <div className="w-px h-4 bg-[#00FFFF]/30"></div>
              <Link href="/metronome" className="group text-white hover:text-[#00FFFF] font-medium transition-all duration-200 relative px-1 py-1 flex items-center space-x-1">
                <span className="text-sm">🥁</span>
                <span className="text-sm">Metronome</span>
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-[#00FFFF] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
            </div>

            {/* Search Bar - Compact */}
            <div className="w-64">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Cari lagu atau artis..."
                  className="w-full py-2 pl-4 pr-10 rounded-lg border-0 bg-[#2A3A4A]/50 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:bg-[#2A3A4A] transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 px-3 flex items-center bg-gradient-to-r from-[#00FFFF] to-[#B0A0D0] text-[#1A2A3A] font-medium rounded-r-lg hover:from-[#B0A0D0] hover:to-[#00FFFF] transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>          {/* Right Section - User Info & Mobile Menu */}
          <div className="flex items-center space-x-2 ml-auto">
            {/* Search Icon for mobile/tablet */}
            <button className="lg:hidden text-white hover:text-[#00FFFF] transition-colors p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Auth State - Desktop Only */}
            {loading ? (
              <div className="w-10 h-10 bg-gradient-to-r from-[#2A3A4A] to-[#3A4A5A] rounded-full animate-pulse hidden lg:block"></div>
            ) : user ? (
              <div className="relative hidden lg:block" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-3 text-white hover:text-[#00FFFF] transition-all duration-200 bg-[#2A3A4A]/30 backdrop-blur-sm rounded-xl px-4 py-2 border border-[#00FFFF]/20 hover:border-[#00FFFF]/50 hover:bg-[#2A3A4A]/50 shadow-lg"
                >
                  <img
                    src={getAvatarUrl()}
                    alt={getDisplayName()}
                    className="w-8 h-8 rounded-full border-2 border-[#00FFFF] shadow-lg"
                  />
                  <div className="text-left">
                    <p className="font-medium text-sm">{getDisplayName()}</p>
                    <p className="text-xs text-gray-300">{user.email?.split('@')[0]}</p>
                  </div>
                  <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl py-2 z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{getDisplayName()}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#E0E8EF] transition-colors">
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profil Saya
                    </Link>
                    {isAdmin && (
                      <Link href="/add-chord" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#E0E8EF] transition-colors">
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Chord
                        <span className="ml-2 px-2 py-1 bg-[#00FFFF] text-[#1A2A3A] text-xs rounded-full">Admin</span>
                      </Link>
                    )}
                    <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#E0E8EF] transition-colors">
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Pengaturan
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-3">
                <Link href="/login" className="text-white hover:text-[#00FFFF] font-medium transition-colors px-3 py-2">
                  Login
                </Link>
                <Link href="/register" className="bg-gradient-to-r from-[#00FFFF] to-[#B0A0D0] text-[#1A2A3A] px-4 py-2 rounded-xl font-semibold hover:from-[#B0A0D0] hover:to-[#00FFFF] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile menu button - ALWAYS LAST */}
            <button
              onClick={toggleMenu}
              className="lg:hidden text-white hover:text-[#00FFFF] transition-colors p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
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
      </div>{/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-4 pt-2 pb-4 space-y-2 bg-gradient-to-b from-[#2A3A4A] to-[#1A2A3A] border-t border-[#00FFFF]/20 backdrop-blur-sm">
            {/* Mobile Search */}
            <div className="mb-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Cari judul lagu atau artis..."
                  className="w-full py-2.5 pl-4 pr-12 rounded-xl border-0 bg-[#3A4A5A]/50 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:bg-[#3A4A5A]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 px-4 flex items-center bg-gradient-to-r from-[#00FFFF] to-[#B0A0D0] text-[#1A2A3A] font-medium rounded-r-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Navigation Links */}
            <Link href="/" className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-[#3A4A5A]/50 hover:text-[#00FFFF] transition-all duration-200">
              🏠 Beranda
            </Link>
            <Link href="/genre" className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-[#3A4A5A]/50 hover:text-[#00FFFF] transition-all duration-200">
              🎵 Genre
            </Link>
            <Link href="/artists" className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-[#3A4A5A]/50 hover:text-[#00FFFF] transition-all duration-200">
              🎤 Artis
            </Link>
            <Link href="/popular" className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-[#3A4A5A]/50 hover:text-[#00FFFF] transition-all duration-200">
              🔥 Terpopuler
            </Link>

            {/* Music Tools Section */}
            <div className="bg-gradient-to-r from-[#00FFFF]/10 to-[#B0A0D0]/10 rounded-xl p-4 border border-[#00FFFF]/20">
              <h4 className="text-[#00FFFF] font-semibold text-sm mb-3 flex items-center">
                <span className="mr-2">🎵</span>
                Tools Musik
              </h4>
              <div className="space-y-2">
                <Link href="/tuning" className="group block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-[#3A4A5A]/50 hover:text-[#00FFFF] transition-all duration-200">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-[#00FFFF]/20 to-[#B0A0D0]/20 rounded-lg mr-3 group-hover:from-[#00FFFF]/30 group-hover:to-[#B0A0D0]/30 transition-all duration-200">
                      🎸
                    </div>
                    <div>
                      <span>Guitar Tuner</span>
                      <p className="text-xs text-gray-400 group-hover:text-gray-300">Tune gitar otomatis & real-time</p>
                    </div>
                  </div>
                </Link>
                <Link href="/metronome" className="group block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-[#3A4A5A]/50 hover:text-[#00FFFF] transition-all duration-200">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-[#00FFFF]/20 to-[#B0A0D0]/20 rounded-lg mr-3 group-hover:from-[#00FFFF]/30 group-hover:to-[#B0A0D0]/30 transition-all duration-200">
                      🥁
                    </div>
                    <div>
                      <span>Metronome</span>
                      <p className="text-xs text-gray-400 group-hover:text-gray-300">Latih tempo & ritme musik</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Mobile Auth State */}
            {loading ? (
              <div className="pt-4 border-t border-[#3A4A5A]/50">
                <div className="flex items-center px-4 py-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#3A4A5A] to-[#4A5A6A] rounded-full animate-pulse mr-3"></div>
                  <div className="space-y-2">
                    <div className="w-24 h-3 bg-[#3A4A5A] rounded animate-pulse"></div>
                    <div className="w-32 h-2 bg-[#3A4A5A] rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ) : user ? (
              <div className="pt-4 border-t border-[#3A4A5A]/50 space-y-2">
                <div className="flex items-center px-4 py-3 bg-[#3A4A5A]/30 rounded-xl">
                  <img
                    src={getAvatarUrl()}
                    alt={getDisplayName()}
                    className="w-10 h-10 rounded-full border-2 border-[#00FFFF] mr-4 shadow-lg"
                  />
                  <div>
                    <p className="text-white font-semibold">{getDisplayName()}</p>
                    <p className="text-gray-300 text-sm truncate">{user.email}</p>
                  </div>
                </div>
                <Link href="/profile" className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-[#3A4A5A]/50 hover:text-[#00FFFF] transition-all duration-200">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profil Saya
                </Link>
                {isAdmin && (
                  <Link href="/add-chord" className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-[#3A4A5A]/50 hover:text-[#00FFFF] transition-all duration-200">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Chord
                    <span className="ml-2 px-2 py-1 bg-[#00FFFF] text-[#1A2A3A] text-xs rounded-full">Admin</span>
                  </Link>
                )}
                <Link href="/settings" className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-[#3A4A5A]/50 hover:text-[#00FFFF] transition-all duration-200">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Pengaturan
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-3 rounded-xl text-base font-medium text-red-400 hover:bg-red-500/20 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Keluar
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-[#3A4A5A]/50 space-y-3">
                <Link href="/login" className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-[#3A4A5A]/50 hover:text-[#00FFFF] transition-all duration-200 text-center">
                  Login
                </Link>
                <Link href="/register" className="block px-4 py-3 rounded-xl text-base font-semibold bg-gradient-to-r from-[#00FFFF] to-[#B0A0D0] text-[#1A2A3A] hover:from-[#B0A0D0] hover:to-[#00FFFF] transition-all duration-300 text-center shadow-lg">
                  Daftar Sekarang
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
