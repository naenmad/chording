'use client'

import { useState, useEffect } from 'react'
import { useRequireAuth } from '@/hooks/useAuth'
import { createSupabaseClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'

export default function ProfilePage() {
    const { user, loading: authLoading } = useRequireAuth()
    const [loading, setLoading] = useState(true)
    const [profileData, setProfileData] = useState({
        full_name: '',
        username: '',
        bio: '',
        location: '',
        website: ''
    })
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

    const supabase = createSupabaseClient()

    useEffect(() => {
        if (user) {
            getProfile()
        }
    }, [user])
    async function getProfile() {
        if (!user) return

        try {
            setLoading(true)

            // Get profile data from profiles table
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (data) {
                setProfileData({
                    full_name: data.full_name || '',
                    username: data.username || '',
                    bio: data.bio || '',
                    location: data.location || '',
                    website: data.website || ''
                })
            }
        } catch (error) {
            console.error('Error loading profile:', error)
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile() {
        try {
            setSaving(true)
            setMessage('')

            if (!user) return

            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    ...profileData,
                    updated_at: new Date().toISOString()
                })

            if (error) {
                setMessage('Error updating profile: ' + error.message)
            } else {
                setMessage('Profile updated successfully!')
                setIsEditing(false)
            }
        } catch (error) {
            setMessage('Error updating profile')
        } finally {
            setSaving(false)
        }
    } if (authLoading || loading) {
        return (
            <div className="bg-[#E0E8EF] min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FFFF]"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!user) {
        return null // useRequireAuth will handle redirect
    }

    return (
        <div className="bg-[#E0E8EF] min-h-screen">
            <div className="container mx-auto px-4 py-8 max-w-4xl">        <div className="bg-white rounded-lg shadow-xl p-6 border-t-4 border-[#00FFFF]">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                    <h1 className="text-3xl font-bold text-[#1A2A3A]">My Profile</h1>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Link
                            href="/settings"
                            className="px-4 py-2 text-[#1A2A3A] border border-gray-300 rounded-lg hover:bg-[#E0E8EF] transition-colors text-center"
                        >
                            Settings
                        </Link>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-[#00FFFF] text-[#1A2A3A] rounded-lg hover:bg-[#B0A0D0] transition-colors font-medium"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-[#1A2A3A] border border-gray-300 rounded-lg hover:bg-[#E0E8EF] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={updateProfile}
                                    disabled={saving}
                                    className="px-4 py-2 bg-[#00FFFF] text-[#1A2A3A] rounded-lg hover:bg-[#B0A0D0] transition-colors font-medium disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>{/* Message */}
                {message && (
                    <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                        {message}
                    </div>
                )}                {/* Profile Content */}
                <div className="grid lg:grid-cols-3 gap-6">                    {/* Left Column - Avatar & Basic Info */}
                    <div className="lg:col-span-1">
                        <div className="text-center">
                            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#00FFFF] to-[#1A2A3A] rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg">
                                {user.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <h2 className="text-xl font-semibold text-[#1A2A3A] mb-1">
                                {profileData.full_name || 'No Name'}
                            </h2>
                            <p className="text-gray-600 mb-2">@{profileData.username || 'username'}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>

                            {/* Provider Info */}
                            <div className="mt-4 p-3 bg-[#E0E8EF] rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-600">
                                    <strong>Account Type:</strong> {user.app_metadata.provider === 'google' ? 'Google' : 'Email'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Profile Details */}
                    <div className="lg:col-span-2">
                        <div className="space-y-6">
                            {/* Full Name */}
                            <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Full Name
                                </label>                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.full_name}
                                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A] bg-white"
                                        placeholder="Enter your full name"
                                    />
                                ) : (
                                    <p className="text-[#1A2A3A] py-2">{profileData.full_name || 'Not specified'}</p>
                                )}
                            </div>

                            {/* Username */}
                            <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Username
                                </label>                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.username}
                                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A] bg-white"
                                        placeholder="Choose a username"
                                    />
                                ) : (
                                    <p className="text-[#1A2A3A] py-2">{profileData.username || 'Not specified'}</p>
                                )}
                            </div>

                            {/* Bio */}
                            <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Bio
                                </label>                                {isEditing ? (
                                    <textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A] bg-white"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-[#1A2A3A] py-2">{profileData.bio || 'No bio added yet'}</p>
                                )}
                            </div>

                            {/* Location */}
                            <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Location
                                </label>                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.location}
                                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A] bg-white"
                                        placeholder="Where are you located?"
                                    />
                                ) : (
                                    <p className="text-[#1A2A3A] py-2">{profileData.location || 'Not specified'}</p>
                                )}
                            </div>

                            {/* Website */}
                            <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                    Website
                                </label>                                {isEditing ? (
                                    <input
                                        type="url"
                                        value={profileData.website}
                                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A] bg-white"
                                        placeholder="https://your-website.com"
                                    />
                                ) : (
                                    <div className="py-2">
                                        {profileData.website ? (
                                            <a
                                                href={profileData.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#00FFFF] hover:text-[#1A2A3A] underline transition-colors"
                                            >
                                                {profileData.website}
                                            </a>
                                        ) : (
                                            <p className="text-[#1A2A3A]">Not specified</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>                {/* Stats Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-[#1A2A3A] mb-4">Activity Stats</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-[#E0E8EF] rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="text-2xl font-bold text-[#00FFFF]">0</div>
                            <div className="text-sm text-gray-600 mt-1">Favorite Chords</div>
                        </div>
                        <div className="text-center p-4 bg-[#E0E8EF] rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="text-2xl font-bold text-[#00FFFF]">0</div>
                            <div className="text-sm text-gray-600 mt-1">Created Playlists</div>
                        </div>
                        <div className="text-center p-4 bg-[#E0E8EF] rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="text-2xl font-bold text-[#00FFFF]">0</div>
                            <div className="text-sm text-gray-600 mt-1">Songs Learned</div>
                        </div>
                        <div className="text-center p-4 bg-[#E0E8EF] rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="text-2xl font-bold text-[#00FFFF]">0</div>
                            <div className="text-sm text-gray-600 mt-1">Practice Hours</div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}
