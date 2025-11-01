'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
}

export default function Profile() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      setProfile(data)
      setFullName(data.full_name || '')
      setBio(data.bio || '')
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          bio: bio
        })
        .eq('id', user.id)

      if (error) throw error

      await fetchProfile()
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/feed')}
            className="text-indigo-600 dark:text-indigo-400 hover:underline mb-4"
          >
            ← Back to Feed
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Profile</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {/* Profile Picture */}
          <div className="flex items-center mb-6">
            <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full mr-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {profile?.full_name || 'No Name'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{profile?.id}</p>
            </div>
          </div>

          {/* Edit Form */}
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(false)
                    setFullName(profile?.full_name || '')
                    setBio(profile?.bio || '')
                  }}
                  className="px-6 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">About</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {profile?.bio || 'No bio yet. Click edit to add one!'}
                </p>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
