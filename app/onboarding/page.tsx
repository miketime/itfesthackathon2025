'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface Interest {
  id: number
  name: string
}

interface Group {
  id: number
  name: string
  interest_id: number
}

interface Subgroup {
  id: number
  name: string
  group_id: number
}

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Data from database
  const [interests, setInterests] = useState<Interest[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [subgroups, setSubgroups] = useState<Subgroup[]>([])

  // User selections
  const [selectedInterests, setSelectedInterests] = useState<number[]>([])
  const [selectedGroups, setSelectedGroups] = useState<number[]>([])
  const [selectedSubgroups, setSelectedSubgroups] = useState<number[]>([])

  // Filtered groups based on selected interests
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // Filter groups based on selected interests
    if (selectedInterests.length > 0) {
      const filtered = groups.filter(group =>
        selectedInterests.includes(group.interest_id)
      )
      setFilteredGroups(filtered)
    } else {
      setFilteredGroups([])
    }
  }, [selectedInterests, groups])

  const fetchData = async () => {
    try {
      // Fetch interests
      const { data: interestsData, error: interestsError } = await supabase
        .from('interests')
        .select('*')
        .order('name')

      if (interestsError) throw interestsError
      setInterests(interestsData || [])

      // Fetch groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*')
        .eq('is_approved', true)
        .order('name')

      if (groupsError) throw groupsError
      setGroups(groupsData || [])

      // Fetch subgroups
      const { data: subgroupsData, error: subgroupsError } = await supabase
        .from('subgroups')
        .select('*')
        .order('name')

      if (subgroupsError) throw subgroupsError
      setSubgroups(subgroupsData || [])

    } catch (error: any) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleInterest = (id: number) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleGroup = (id: number) => {
    setSelectedGroups(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  const toggleSubgroup = (id: number) => {
    setSelectedSubgroups(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleNext = () => {
    if (currentStep === 1 && selectedInterests.length === 0) {
      alert('Please select at least one interest')
      return
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      handleFinish()
    }
  }

  const handleSkip = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      handleFinish()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      // Save interest subscriptions
      if (selectedInterests.length > 0) {
        const interestSubscriptions = selectedInterests.map(interest_id => ({
          user_id: user.id,
          interest_id
        }))

        const { error: interestError } = await supabase
          .from('user_interest_subscriptions')
          .insert(interestSubscriptions)

        if (interestError) throw interestError
      }

      // Save group subscriptions
      if (selectedGroups.length > 0) {
        const groupSubscriptions = selectedGroups.map(group_id => ({
          user_id: user.id,
          group_id
        }))

        const { error: groupError } = await supabase
          .from('user_group_subscriptions')
          .insert(groupSubscriptions)

        if (groupError) throw groupError
      }

      // Save subgroup subscriptions
      if (selectedSubgroups.length > 0) {
        const subgroupSubscriptions = selectedSubgroups.map(subgroup_id => ({
          user_id: user.id,
          subgroup_id
        }))

        const { error: subgroupError } = await supabase
          .from('user_subgroup_subscriptions')
          .insert(subgroupSubscriptions)

        if (subgroupError) throw subgroupError
      }

      // Redirect to feed
      router.push('/feed')
    } catch (error: any) {
      console.error('Error saving subscriptions:', error)
      alert('Error saving your preferences. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Welcome! Let's personalize your experience
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose your interests to customize your feed
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep === step
                      ? 'bg-indigo-600 text-white'
                      : currentStep > step
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {currentStep > step ? '✓' : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 ${
                      currentStep > step
                        ? 'bg-green-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          {/* Step 1: Interests */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                Select Your Interests
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose the topics you're interested in
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {interests.map(interest => (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                      selectedInterests.includes(interest.id)
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-400'
                    }`}
                  >
                    {interest.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Groups */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                Select Groups (Optional)
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Narrow down your interests by selecting specific groups
              </p>
              {filteredGroups.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {filteredGroups.map(group => (
                    <button
                      key={group.id}
                      onClick={() => toggleGroup(group.id)}
                      className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                        selectedGroups.includes(group.id)
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-400'
                      }`}
                    >
                      {group.name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  No groups available for your selected interests
                </div>
              )}
            </div>
          )}

          {/* Step 3: Subgroups */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                Select Subgroups (Optional)
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Get even more specific with subgroups
              </p>
              {subgroups.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {subgroups
                    .filter(subgroup =>
                      selectedGroups.includes(subgroup.group_id)
                    )
                    .map(subgroup => (
                      <button
                        key={subgroup.id}
                        onClick={() => toggleSubgroup(subgroup.id)}
                        className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                          selectedSubgroups.includes(subgroup.id)
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-400'
                        }`}
                      >
                        {subgroup.name}
                      </button>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  No subgroups available yet
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-2 rounded-lg font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Back
            </button>

            <div className="flex gap-4">
              {currentStep > 1 && (
                <button
                  onClick={handleSkip}
                  disabled={saving}
                  className="px-6 py-2 rounded-lg font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
                >
                  Skip
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={saving || (currentStep === 1 && selectedInterests.length === 0)}
                className="px-6 py-2 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-400 disabled:cursor-not-allowed transition"
              >
                {saving ? 'Saving...' : currentStep === 3 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
