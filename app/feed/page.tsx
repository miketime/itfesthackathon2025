'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

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

interface Post {
  id: number
  content: string
  created_at: string
  user_id: string
  subgroup_id: number
  profiles?: {
    full_name: string | null
    avatar_url: string | null
  } | {
    full_name: string | null
    avatar_url: string | null
  }[]
}

interface User {
  id: string
  full_name: string
  avatar_url: string | null
}

export default function Feed() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [expandedInterests, setExpandedInterests] = useState<number[]>([])
  const [expandedGroups, setExpandedGroups] = useState<number[]>([])

  // Data
  const [interests, setInterests] = useState<Interest[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [subgroups, setSubgroups] = useState<Subgroup[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])

  // Filters
  const [selectedInterests, setSelectedInterests] = useState<number[]>([])
  const [selectedGroups, setSelectedGroups] = useState<number[]>([])
  const [selectedSubgroups, setSelectedSubgroups] = useState<number[]>([])

  // Search
  const [searchQuery, setSearchQuery] = useState('')

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [selectedInterests, selectedGroups, selectedSubgroups])

  const fetchData = async () => {
    try {
      // Fetch interests
      const { data: interestsData } = await supabase
        .from('interests')
        .select('*')
        .order('name')
      setInterests(interestsData || [])

      // Fetch groups
      const { data: groupsData } = await supabase
        .from('groups')
        .select('*')
        .eq('is_approved', true)
        .order('name')
      setGroups(groupsData || [])

      // Fetch subgroups
      const { data: subgroupsData } = await supabase
        .from('subgroups')
        .select('*')
        .order('name')
      setSubgroups(subgroupsData || [])

      // Fetch users for search
      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
      setUsers(usersData || [])

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      // If no filters selected, don't fetch posts
      if (selectedInterests.length === 0 && selectedGroups.length === 0 && selectedSubgroups.length === 0) {
        setPosts([])
        return
      }

      // Build filter for subgroups based on selections
      let subgroupFilter: number[] = [...selectedSubgroups]

      // Add subgroups from selected groups
      if (selectedGroups.length > 0) {
        const groupSubgroups = subgroups
          .filter(sg => selectedGroups.includes(sg.group_id))
          .map(sg => sg.id)
        subgroupFilter = [...subgroupFilter, ...groupSubgroups]
      }

      // Add subgroups from selected interests
      if (selectedInterests.length > 0) {
        const interestGroups = groups
          .filter(g => selectedInterests.includes(g.interest_id))
          .map(g => g.id)
        const interestSubgroups = subgroups
          .filter(sg => interestGroups.includes(sg.group_id))
          .map(sg => sg.id)
        subgroupFilter = [...subgroupFilter, ...interestSubgroups]
      }

      // Remove duplicates
      subgroupFilter = Array.from(new Set(subgroupFilter))

      if (subgroupFilter.length === 0) {
        setPosts([])
        return
      }

      // Fetch posts from selected subgroups
      const { data: postsData } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          user_id,
          subgroup_id,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .in('subgroup_id', subgroupFilter)
        .order('created_at', { ascending: false })
        .limit(50)

      setPosts(postsData || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const toggleInterest = (id: number) => {
    setExpandedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleGroup = (id: number) => {
    setExpandedGroups(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  const handleCheckInterest = (id: number) => {
    setSelectedInterests(prev => {
      const isChecked = prev.includes(id)

      if (isChecked) {
        // Unchecking interest - uncheck all child groups and subgroups
        const childGroupIds = groups
          .filter(g => g.interest_id === id)
          .map(g => g.id)

        setSelectedGroups(prevGroups =>
          prevGroups.filter(gId => !childGroupIds.includes(gId))
        )

        const childSubgroupIds = subgroups
          .filter(sg => childGroupIds.includes(sg.group_id))
          .map(sg => sg.id)

        setSelectedSubgroups(prevSubgroups =>
          prevSubgroups.filter(sgId => !childSubgroupIds.includes(sgId))
        )

        return prev.filter(i => i !== id)
      } else {
        // Checking interest - check all child groups and subgroups
        const childGroupIds = groups
          .filter(g => g.interest_id === id)
          .map(g => g.id)

        setSelectedGroups(prevGroups =>
          Array.from(new Set([...prevGroups, ...childGroupIds]))
        )

        const childSubgroupIds = subgroups
          .filter(sg => childGroupIds.includes(sg.group_id))
          .map(sg => sg.id)

        setSelectedSubgroups(prevSubgroups =>
          Array.from(new Set([...prevSubgroups, ...childSubgroupIds]))
        )

        return [...prev, id]
      }
    })
  }

  const handleCheckGroup = (id: number) => {
    setSelectedGroups(prev => {
      const isChecked = prev.includes(id)

      if (isChecked) {
        // Unchecking group - uncheck all child subgroups
        const childSubgroupIds = subgroups
          .filter(sg => sg.group_id === id)
          .map(sg => sg.id)

        setSelectedSubgroups(prevSubgroups =>
          prevSubgroups.filter(sgId => !childSubgroupIds.includes(sgId))
        )

        return prev.filter(g => g !== id)
      } else {
        // Checking group - check all child subgroups
        const childSubgroupIds = subgroups
          .filter(sg => sg.group_id === id)
          .map(sg => sg.id)

        setSelectedSubgroups(prevSubgroups =>
          Array.from(new Set([...prevSubgroups, ...childSubgroupIds]))
        )

        return [...prev, id]
      }
    })
  }

  const handleCheckSubgroup = (id: number) => {
    setSelectedSubgroups(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Banner */}
      <div className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="max-w-full px-4 py-3 flex items-center justify-between">
          {/* Left: Hamburger Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2">
                <button
                  onClick={() => router.push('/settings')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Settings
                </button>
              </div>
            )}
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">LOGO</span>
            </div>
          </div>

          {/* Right: Profile */}
          <button
            onClick={() => router.push('/profile')}
            className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center hover:opacity-80"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3-Panel Layout */}
      <div className="flex max-w-full">
        {/* Left Panel - 25% - Categories */}
        <div className="w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-64px)] overflow-y-auto p-4">
          <h2 className="font-bold text-lg mb-4">Interests</h2>
          {interests.map(interest => (
            <div key={interest.id} className="mb-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={selectedInterests.includes(interest.id)}
                    onChange={() => handleCheckInterest(interest.id)}
                    className="mr-2"
                  />
                  <span className="text-sm">{interest.name}</span>
                </label>
                <button
                  onClick={() => toggleInterest(interest.id)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedInterests.includes(interest.id) ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {expandedInterests.includes(interest.id) && (
                <div className="ml-6 mt-2">
                  {groups
                    .filter(g => g.interest_id === interest.id)
                    .map(group => (
                      <div key={group.id} className="mb-1">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center cursor-pointer flex-1">
                            <input
                              type="checkbox"
                              checked={selectedGroups.includes(group.id)}
                              onChange={() => handleCheckGroup(group.id)}
                              className="mr-2"
                            />
                            <span className="text-xs">{group.name}</span>
                          </label>
                          <button
                            onClick={() => toggleGroup(group.id)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          >
                            <svg
                              className={`w-3 h-3 transition-transform ${expandedGroups.includes(group.id) ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        {expandedGroups.includes(group.id) && (
                          <div className="ml-6 mt-1">
                            {subgroups
                              .filter(sg => sg.group_id === group.id)
                              .map(subgroup => (
                                <label key={subgroup.id} className="flex items-center cursor-pointer mb-1">
                                  <input
                                    type="checkbox"
                                    checked={selectedSubgroups.includes(subgroup.id)}
                                    onChange={() => handleCheckSubgroup(subgroup.id)}
                                    className="mr-2"
                                  />
                                  <span className="text-xs">{subgroup.name}</span>
                                </label>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Middle Panel - 50% - Posts */}
        <div className="w-1/2 h-[calc(100vh-64px)] overflow-y-auto p-6">
          <h2 className="font-bold text-2xl mb-6">Feed</h2>
          {posts.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Select interests, groups, or subgroups to see posts
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post: Post) => {
                const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles
                return (
                  <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
                      <div>
                        <p className="font-semibold">{profile?.full_name || 'Unknown User'}</p>
                        <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Panel - 25% - Users & Messages */}
        <div className="w-1/4 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 h-[calc(100vh-64px)] overflow-y-auto p-4">
          <div className="mb-6">
            <h3 className="font-bold mb-3">Search Users</h3>
            <input
              type="text"
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
            />
            {searchQuery && (
              <div className="mt-2 space-y-2">
                {filteredUsers.slice(0, 5).map(user => (
                  <div key={user.id} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full mr-2"></div>
                    <span className="text-sm">{user.full_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-bold mb-3">Messages</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">No messages yet</p>
          </div>
        </div>
      </div>
    </div>
  )
}
