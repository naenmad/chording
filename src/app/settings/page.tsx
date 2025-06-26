'use client'

import { useState, useEffect } from 'react'
import { useRequireAuth } from '@/hooks/useAuth'
import { createSupabaseClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
    const { user, loading: authLoading } = useRequireAuth()
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [message, setMessage] = useState('')
    const [activeTab, setActiveTab] = useState('account')

    const [accountData, setAccountData] = useState({
        email: '',
        current_password: '',
        new_password: '',
        confirm_password: ''
    })

    const [preferences, setPreferences] = useState({
        email_notifications: true,
        practice_reminders: false,
        new_features: true,
        marketing_emails: false,
        auto_scroll_speed: 'medium',
        default_instrument: 'guitar',
        chord_display: 'diagram'
    })
    const supabase = createSupabaseClient()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            loadSettings()
        }
    }, [user])

    async function loadSettings() {
        if (!user) return

        try {
            setLoading(true)
            setAccountData(prev => ({ ...prev, email: user.email || '' }))

            // Get user preferences
            const { data } = await supabase
                .from('user_preferences')
                .select('*')
                .eq('user_id', user.id)
                .single()

            if (data) {
                setPreferences(prev => ({ ...prev, ...data }))
            }
        } catch (error) {
            console.error('Error loading user data:', error)
        } finally {
            setLoading(false)
        }
    }

    async function updateEmail() {
        try {
            setUpdating(true)
            setMessage('')

            const { error } = await supabase.auth.updateUser({
                email: accountData.email
            })

            if (error) {
                setMessage('Error updating email: ' + error.message)
            } else {
                setMessage('Please check your new email for confirmation link.')
            }
        } catch (error) {
            setMessage('Error updating email')
        } finally {
            setUpdating(false)
        }
    }

    async function updatePassword() {
        try {
            setUpdating(true)
            setMessage('')

            if (accountData.new_password !== accountData.confirm_password) {
                setMessage('Passwords do not match')
                return
            }

            if (accountData.new_password.length < 6) {
                setMessage('Password must be at least 6 characters')
                return
            }

            const { error } = await supabase.auth.updateUser({
                password: accountData.new_password
            })

            if (error) {
                setMessage('Error updating password: ' + error.message)
            } else {
                setMessage('Password updated successfully!')
                setAccountData(prev => ({
                    ...prev,
                    current_password: '',
                    new_password: '',
                    confirm_password: ''
                }))
            }
        } catch (error) {
            setMessage('Error updating password')
        } finally {
            setUpdating(false)
        }
    }

    async function updatePreferences() {
        try {
            setUpdating(true)
            setMessage('')

            if (!user) return

            const { error } = await supabase
                .from('user_preferences')
                .upsert({
                    user_id: user.id,
                    ...preferences,
                    updated_at: new Date().toISOString()
                })

            if (error) {
                setMessage('Error updating preferences: ' + error.message)
            } else {
                setMessage('Preferences updated successfully!')
            }
        } catch (error) {
            setMessage('Error updating preferences')
        } finally {
            setUpdating(false)
        }
    }

    async function signOut() {
        await supabase.auth.signOut()
        router.push('/')
    }

    async function deleteAccount() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                setUpdating(true)

                // Note: Account deletion should be handled server-side
                // This is a simplified example
                setMessage('Account deletion requested. Please contact support to complete this process.')

            } catch (error) {
                setMessage('Error deleting account')
            } finally {
                setUpdating(false)
            }
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
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-white rounded-lg shadow-xl border-t-4 border-[#00FFFF]">          {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold text-[#1A2A3A]">Settings</h1>
                            <Link
                                href="/profile"
                                className="px-4 py-2 text-[#1A2A3A] border border-gray-300 rounded-lg hover:bg-[#E0E8EF] transition-colors"
                            >
                                View Profile
                            </Link>
                        </div>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`mx-6 mt-4 p-4 rounded-lg border ${message.includes('Error') ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'
                            }`}>
                            {message}
                        </div>
                    )}                    <div className="flex flex-col lg:flex-row">
                        {/* Sidebar Navigation */}
                        <div className="lg:w-1/4 p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('account')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'account' ? 'bg-[#E0E8EF] text-[#1A2A3A] border border-[#00FFFF]' : 'text-gray-600 hover:bg-gray-100 hover:text-[#1A2A3A]'
                                        }`}
                                >
                                    Account
                                </button>
                                <button
                                    onClick={() => setActiveTab('preferences')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'preferences' ? 'bg-[#E0E8EF] text-[#1A2A3A] border border-[#00FFFF]' : 'text-gray-600 hover:bg-gray-100 hover:text-[#1A2A3A]'
                                        }`}
                                >
                                    Preferences
                                </button>
                                <button
                                    onClick={() => setActiveTab('notifications')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'notifications' ? 'bg-[#E0E8EF] text-[#1A2A3A] border border-[#00FFFF]' : 'text-gray-600 hover:bg-gray-100 hover:text-[#1A2A3A]'
                                        }`}
                                >
                                    Notifications
                                </button>
                                <button
                                    onClick={() => setActiveTab('privacy')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'privacy' ? 'bg-[#E0E8EF] text-[#1A2A3A] border border-[#00FFFF]' : 'text-gray-600 hover:bg-gray-100 hover:text-[#1A2A3A]'
                                        }`}
                                >
                                    Privacy & Security
                                </button>
                            </nav>
                        </div>

                        {/* Main Content */}
                        <div className="lg:w-3/4 p-6">
                            {/* Account Tab */}
                            {activeTab === 'account' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-[#1A2A3A]">Account Settings</h2>
                  /* Email Update */
                                    <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                        <h3 className="font-medium text-[#1A2A3A] mb-3">Email Address</h3>
                                        <div className="space-y-3">                                            <input
                                            type="email"
                                            value={accountData.email}
                                            onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A] bg-white"
                                            placeholder="Enter new email"
                                        />
                                            <button
                                                onClick={updateEmail}
                                                disabled={updating}
                                                className="bg-[#00FFFF] text-[#1A2A3A] px-4 py-2 rounded-lg hover:bg-[#B0A0D0] transition-colors font-medium disabled:opacity-50"
                                            >
                                                {updating ? 'Updating...' : 'Update Email'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Password Update - Only for email users */}
                                    {user.app_metadata.provider === 'email' && (
                                        <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                            <h3 className="font-medium text-[#1A2A3A] mb-3">Change Password</h3>
                                            <div className="space-y-3">                                                <input
                                                type="password"
                                                value={accountData.new_password}
                                                onChange={(e) => setAccountData({ ...accountData, new_password: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A] bg-white"
                                                placeholder="New password"
                                            />
                                                <input
                                                    type="password"
                                                    value={accountData.confirm_password}
                                                    onChange={(e) => setAccountData({ ...accountData, confirm_password: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A] bg-white"
                                                    placeholder="Confirm new password"
                                                /><button
                                                    onClick={updatePassword}
                                                    disabled={updating}
                                                    className="bg-[#00FFFF] text-[#1A2A3A] px-4 py-2 rounded-lg hover:bg-[#B0A0D0] transition-colors font-medium disabled:opacity-50"
                                                >
                                                    {updating ? 'Updating...' : 'Update Password'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Account Info */}
                                    <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                        <h3 className="font-medium text-[#1A2A3A] mb-3">Account Information</h3>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <p><strong>Account Type:</strong> {user.app_metadata.provider === 'google' ? 'Google' : 'Email'}</p>
                                            <p><strong>Member Since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                                            <p><strong>Last Sign In:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === 'preferences' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-[#1A2A3A]">App Preferences</h2>

                                    <div className="space-y-4">                                        {/* Auto Scroll Speed */}
                                        <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                            <label className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                                Auto Scroll Speed
                                            </label>                                            <select
                                                value={preferences.auto_scroll_speed}
                                                onChange={(e) => setPreferences({ ...preferences, auto_scroll_speed: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A] bg-white"
                                            >
                                                <option value="slow">Slow</option>
                                                <option value="medium">Medium</option>
                                                <option value="fast">Fast</option>
                                            </select>
                                        </div>

                                        {/* Default Instrument */}
                                        <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                            <label className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                                Default Instrument
                                            </label>                                            <select
                                                value={preferences.default_instrument}
                                                onChange={(e) => setPreferences({ ...preferences, default_instrument: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A] bg-white"
                                            >
                                                <option value="guitar">Guitar</option>
                                                <option value="ukulele">Ukulele</option>
                                                <option value="piano">Piano</option>
                                            </select>
                                        </div>

                                        {/* Chord Display */}
                                        <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                            <label className="block text-sm font-medium text-[#1A2A3A] mb-2">
                                                Chord Display Style
                                            </label>                                            <select
                                                value={preferences.chord_display}
                                                onChange={(e) => setPreferences({ ...preferences, chord_display: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent text-[#1A2A3A] bg-white"
                                            >
                                                <option value="diagram">Diagram</option>
                                                <option value="text">Text Only</option>
                                                <option value="both">Both</option>
                                            </select>
                                        </div>

                                        <button
                                            onClick={updatePreferences}
                                            disabled={updating}
                                            className="bg-[#00FFFF] text-[#1A2A3A] px-4 py-2 rounded-lg hover:bg-[#B0A0D0] transition-colors font-medium disabled:opacity-50"
                                        >
                                            {updating ? 'Saving...' : 'Save Preferences'}
                                        </button>
                                    </div>
                                </div>
                            )}                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-[#1A2A3A]">Notification Settings</h2>

                                    <div className="space-y-4">
                                        {/* Email Notifications */}
                                        <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium text-[#1A2A3A]">Email Notifications</h3>
                                                    <p className="text-sm text-gray-600">Receive updates about your account</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={preferences.email_notifications}
                                                    onChange={(e) => setPreferences({ ...preferences, email_notifications: e.target.checked })}
                                                    className="w-4 h-4 text-[#00FFFF] focus:ring-[#00FFFF] border-gray-300 rounded"
                                                />
                                            </div>
                                        </div>

                                        {/* Practice Reminders */}
                                        <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium text-[#1A2A3A]">Practice Reminders</h3>
                                                    <p className="text-sm text-gray-600">Get reminded to practice regularly</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={preferences.practice_reminders}
                                                    onChange={(e) => setPreferences({ ...preferences, practice_reminders: e.target.checked })}
                                                    className="w-4 h-4 text-[#00FFFF] focus:ring-[#00FFFF] border-gray-300 rounded"
                                                />
                                            </div>
                                        </div>

                                        {/* New Features */}
                                        <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium text-[#1A2A3A]">New Features</h3>
                                                    <p className="text-sm text-gray-600">Be notified about new app features</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={preferences.new_features}
                                                    onChange={(e) => setPreferences({ ...preferences, new_features: e.target.checked })}
                                                    className="w-4 h-4 text-[#00FFFF] focus:ring-[#00FFFF] border-gray-300 rounded"
                                                />
                                            </div>
                                        </div>

                                        {/* Marketing Emails */}
                                        <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium text-[#1A2A3A]">Marketing Emails</h3>
                                                    <p className="text-sm text-gray-600">Receive promotional content and tips</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={preferences.marketing_emails}
                                                    onChange={(e) => setPreferences({ ...preferences, marketing_emails: e.target.checked })}
                                                    className="w-4 h-4 text-[#00FFFF] focus:ring-[#00FFFF] border-gray-300 rounded"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={updatePreferences}
                                            disabled={updating}
                                            className="bg-[#00FFFF] text-[#1A2A3A] px-4 py-2 rounded-lg hover:bg-[#B0A0D0] transition-colors font-medium disabled:opacity-50"
                                        >
                                            {updating ? 'Saving...' : 'Save Notifications'}
                                        </button>
                                    </div>
                                </div>
                            )}                            {/* Privacy & Security Tab */}
                            {activeTab === 'privacy' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-[#1A2A3A]">Privacy & Security</h2>

                                    <div className="space-y-4">
                                        {/* Sign Out */}
                                        <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                            <h3 className="font-medium text-[#1A2A3A] mb-2">Sign Out</h3>
                                            <p className="text-sm text-gray-600 mb-3">Sign out from all devices</p>
                                            <button
                                                onClick={signOut}
                                                className="bg-[#1A2A3A] text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                            >
                                                Sign Out
                                            </button>
                                        </div>

                                        {/* Delete Account */}
                                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                            <h3 className="font-medium text-red-800 mb-2">Delete Account</h3>
                                            <p className="text-sm text-red-600 mb-3">
                                                Permanently delete your account and all associated data. This action cannot be undone.
                                            </p>
                                            <button
                                                onClick={deleteAccount}
                                                disabled={updating}
                                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                                            >
                                                {updating ? 'Processing...' : 'Delete Account'}
                                            </button>
                                        </div>

                                        {/* Data Download */}
                                        <div className="bg-[#E0E8EF] p-4 rounded-lg border border-gray-200">
                                            <h3 className="font-medium text-[#1A2A3A] mb-2">Download Your Data</h3>
                                            <p className="text-sm text-gray-600 mb-3">
                                                Request a copy of your personal data
                                            </p>
                                            <button
                                                className="bg-[#00FFFF] text-[#1A2A3A] px-4 py-2 rounded-lg hover:bg-[#B0A0D0] transition-colors font-medium"
                                                onClick={() => setMessage('Data export feature coming soon!')}
                                            >
                                                Request Data Export
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>        </div>
                </div>
            </div>
        </div>
    )
}
