'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a2238] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-[#9daaf2] hover:text-[#ff6a3d] hover:underline mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
        </div>

        <div className="bg-white dark:bg-[#1a2238] rounded-lg shadow border border-gray-200 dark:border-[#9daaf2] p-6 space-y-6">
          {/* Account Settings */}
          <div className="py-4 border-b border-gray-200 dark:border-[#9daaf2]">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Account</h3>
            <button
              onClick={() => router.push('/profile')}
              className="text-[#9daaf2] hover:text-[#ff6a3d] hover:underline text-sm"
            >
              Edit Profile
            </button>
          </div>

          {/* Logout */}
          <div className="pt-4">
            <button
              onClick={handleLogout}
              className="w-full bg-[#ff6a3d] hover:bg-[#9daaf2] text-white font-semibold py-3 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
