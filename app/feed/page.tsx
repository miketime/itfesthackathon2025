'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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

interface Message {
  id: number
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  sender?: {
    full_name: string | null
  } | {
    full_name: string | null
  }[]
  receiver?: {
    full_name: string | null
  } | {
    full_name: string | null
  }[]
}

interface Comment {
  id: number
  content: string
  user_id: string
  post_id: number
  created_at: string
  profiles?: {
    full_name: string | null
  } | {
    full_name: string | null
  }[]
}

interface PostLike {
  user_id: string
  post_id: number
  profiles?: {
    full_name: string | null
  } | {
    full_name: string | null
  }[]
}

export default function Feed() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
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

  // Messaging
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Post interactions
  const [postComments, setPostComments] = useState<Record<number, Comment[]>>({})
  const [postLikes, setPostLikes] = useState<Record<number, PostLike[]>>({})
  const [expandedComments, setExpandedComments] = useState<number[]>([])
  const [newComment, setNewComment] = useState<Record<number, string>>({})
  const [showCommentInput, setShowCommentInput] = useState<number[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [selectedInterests, selectedGroups, selectedSubgroups])

  useEffect(() => {
    if (selectedUser && currentUserId) {
      fetchMessages(selectedUser.id)
    }
  }, [selectedUser, currentUserId])

  useEffect(() => {
    if (!selectedUser || !currentUserId) return

    // Subscribe to real-time message updates
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUserId}))`
        },
        (payload) => {
          // Refetch messages to include the new message with profile data
          fetchMessages(selectedUser.id)
          fetchUnreadCounts()
        }
      )
      .subscribe()

    // Cleanup subscription on unmount or when selectedUser changes
    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedUser, currentUserId])

  useEffect(() => {
    if (currentUserId) {
      fetchUnreadCounts()
    }
  }, [currentUserId])

  useEffect(() => {
    if (posts.length > 0) {
      fetchPostInteractions()
    }
  }, [posts])

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const fetchData = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

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

      // Store current user ID
      if (user) {
        setCurrentUserId(user.id)
      }

      // Fetch user's subscriptions if logged in
      if (user) {
        // Fetch interest subscriptions
        const { data: interestSubs } = await supabase
          .from('user_interest_subscriptions')
          .select('interest_id')
          .eq('user_id', user.id)

        if (interestSubs) {
          const interestIds = interestSubs.map(sub => sub.interest_id)
          setSelectedInterests(interestIds)
        }

        // Fetch group subscriptions
        const { data: groupSubs } = await supabase
          .from('user_group_subscriptions')
          .select('group_id')
          .eq('user_id', user.id)

        if (groupSubs) {
          const groupIds = groupSubs.map(sub => sub.group_id)
          setSelectedGroups(groupIds)
        }

        // Fetch subgroup subscriptions
        const { data: subgroupSubs } = await supabase
          .from('user_subgroup_subscriptions')
          .select('subgroup_id')
          .eq('user_id', user.id)

        if (subgroupSubs) {
          const subgroupIds = subgroupSubs.map(sub => sub.subgroup_id)
          setSelectedSubgroups(subgroupIds)
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      // If no filters selected, show all posts
      if (selectedInterests.length === 0 && selectedGroups.length === 0 && selectedSubgroups.length === 0) {
        setPosts([])
        return
      }

      // Build filter for subgroups based on selections
      let subgroupFilter: number[] = [...selectedSubgroups]

      // Add subgroups from selected groups (independent of interests)
      if (selectedGroups.length > 0) {
        const groupSubgroups = subgroups
          .filter((sg: Subgroup) => selectedGroups.includes(sg.group_id))
          .map((sg: Subgroup) => sg.id)
        subgroupFilter = [...subgroupFilter, ...groupSubgroups]
      }

      // Add subgroups from selected interests
      if (selectedInterests.length > 0) {
        const interestGroups = groups
          .filter((g: Group) => selectedInterests.includes(g.interest_id))
          .map((g: Group) => g.id)
        const interestSubgroups = subgroups
          .filter((sg: Subgroup) => interestGroups.includes(sg.group_id))
          .map((sg: Subgroup) => sg.id)
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

  const fetchMessages = async (userId: string) => {
    if (!currentUserId) return

    try {
      const { data: messagesData } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          receiver_id,
          content,
          created_at,
          sender:sender_id (full_name),
          receiver:receiver_id (full_name)
        `)
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true })

      setMessages(messagesData || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const fetchUnreadCounts = async () => {
    if (!currentUserId) return

    try {
      // Get all users the current user has conversed with
      const { data: conversations } = await supabase
        .from('messages')
        .select('sender_id, receiver_id')
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)

      if (!conversations) return

      // Get unique user IDs
      const userIds = Array.from(new Set(
        conversations.map((c: any) => c.sender_id === currentUserId ? c.receiver_id : c.sender_id)
      ))

      // Count unread messages from each user
      const counts: Record<string, number> = {}
      for (const userId of userIds) {
        const { count } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('sender_id', userId)
          .eq('receiver_id', currentUserId)
          .is('read_at', null)

        counts[userId as string] = count || 0
      }

      setUnreadCounts(counts)
    } catch (error) {
      console.error('Error fetching unread counts:', error)
    }
  }

  const sendMessage = async () => {
    if (!selectedUser || !currentUserId || !newMessage.trim()) return

    try {
      await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          receiver_id: selectedUser.id,
          content: newMessage.trim()
        })

      setNewMessage('')
      fetchMessages(selectedUser.id)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const fetchPostInteractions = async () => {
    try {
      const postIds = posts.map((p: Post) => p.id)

      // Fetch comments for all posts
      const { data: commentsData } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          user_id,
          post_id,
          created_at,
          profiles:user_id (
            full_name
          )
        `)
        .in('post_id', postIds)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: true })

      // Fetch likes for all posts
      const { data: likesData } = await supabase
        .from('post_likes')
        .select(`
          user_id,
          post_id,
          profiles:user_id (
            full_name
          )
        `)
        .in('post_id', postIds)

      // Group comments by post_id
      const commentsByPost: Record<number, Comment[]> = {}
      commentsData?.forEach((comment: any) => {
        if (!commentsByPost[comment.post_id]) {
          commentsByPost[comment.post_id] = []
        }
        commentsByPost[comment.post_id].push(comment)
      })

      // Group likes by post_id
      const likesByPost: Record<number, PostLike[]> = {}
      likesData?.forEach((like: any) => {
        if (!likesByPost[like.post_id]) {
          likesByPost[like.post_id] = []
        }
        likesByPost[like.post_id].push(like)
      })

      setPostComments(commentsByPost)
      setPostLikes(likesByPost)
    } catch (error) {
      console.error('Error fetching post interactions:', error)
    }
  }

  const toggleComments = (postId: number) => {
    setExpandedComments(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    )
  }

  const toggleCommentInput = (postId: number) => {
    setShowCommentInput(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    )
  }

  const handleLike = async (postId: number) => {
    if (!currentUserId) return

    try {
      const currentLikes = postLikes[postId] || []
      const hasLiked = currentLikes.some(like => like.user_id === currentUserId)

      if (hasLiked) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', currentUserId)

        setPostLikes(prev => ({
          ...prev,
          [postId]: currentLikes.filter(like => like.user_id !== currentUserId)
        }))
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: currentUserId
          })

        setPostLikes(prev => ({
          ...prev,
          [postId]: [...currentLikes, { user_id: currentUserId, post_id: postId }]
        }))
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleComment = async (postId: number) => {
    if (!currentUserId || !newComment[postId]?.trim()) return

    try {
      const { data } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: currentUserId,
          content: newComment[postId].trim(),
          parent_comment_id: null
        })
        .select(`
          id,
          content,
          user_id,
          post_id,
          created_at,
          profiles:user_id (
            full_name
          )
        `)
        .single()

      if (data) {
        const currentComments = postComments[postId] || []
        setPostComments(prev => ({
          ...prev,
          [postId]: [...currentComments, data]
        }))

        setNewComment(prev => ({ ...prev, [postId]: '' }))
        setShowCommentInput(prev => prev.filter(id => id !== postId))
      }
    } catch (error) {
      console.error('Error adding comment:', error)
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

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a2238]">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#1a2238] shadow-md sticky top-0 z-50">
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
              <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#1a2238] rounded-lg shadow-lg py-2 border border-gray-200 dark:border-[#9daaf2]">
                {/* Dark Mode Toggle */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-[#9daaf2]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                    <button
                      onClick={toggleDarkMode}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        darkMode ? 'bg-[#9daaf2]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#9daaf2]/20 text-[#ff6a3d] font-medium transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-12 rounded-lg overflow-hidden">
              <Image
                src="/logo1.png"
                alt="Logo"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Profile */}
          <button
            onClick={() => router.push('/profile')}
            className="w-10 h-10 bg-gray-300 dark:bg-[#9daaf2] rounded-full flex items-center justify-center hover:opacity-80"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3-Panel Layout */}
      <div className="flex max-w-full">
        {/* Left Panel - 15% - Categories */}
        <div className="w-[15%] bg-white dark:bg-[#1a2238] border-r border-gray-200 dark:border-[#9daaf2] h-[calc(100vh-64px)] overflow-y-auto p-6">
          <h2 className="font-bold text-xl mb-6 text-gray-900 dark:text-white">Interests</h2>
          {interests.map(interest => (
            <div key={interest.id} className="mb-4">
              <div className="flex items-center justify-between bg-gray-50 dark:bg-[#1a2238] border border-gray-200 dark:border-[#9daaf2] rounded-lg p-3 hover:border-[#ff6a3d] dark:hover:border-[#ff6a3d] transition">
                <label className="flex items-center cursor-pointer flex-1 group">
                  <input
                    type="checkbox"
                    checked={selectedInterests.includes(interest.id)}
                    onChange={() => handleCheckInterest(interest.id)}
                    className="w-4 h-4 mr-3 accent-[#9daaf2] cursor-pointer"
                  />
                  <span className="text-base font-medium text-gray-800 dark:text-gray-200 group-hover:text-[#ff6a3d] dark:group-hover:text-[#ff6a3d] transition">{interest.name}</span>
                </label>
                <button
                  onClick={() => toggleInterest(interest.id)}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#9daaf2]/20 rounded-md transition"
                >
                  <svg
                    className={`w-4 h-4 transition-transform text-gray-600 dark:text-gray-400 ${expandedInterests.includes(interest.id) ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {expandedInterests.includes(interest.id) && (
                <div className="ml-7 mt-3 space-y-2">
                  {groups
                    .filter(g => g.interest_id === interest.id)
                    .map(group => (
                      <div key={group.id} className="mb-2">
                        <div className="flex items-center justify-between bg-gray-100 dark:bg-[#1a2238] border border-gray-300 dark:border-[#9daaf2] rounded-md p-2 hover:border-[#ff6a3d] dark:hover:border-[#ff6a3d] transition">
                          <label className="flex items-center cursor-pointer flex-1 group">
                            <input
                              type="checkbox"
                              checked={selectedGroups.includes(group.id)}
                              onChange={() => handleCheckGroup(group.id)}
                              className="w-3.5 h-3.5 mr-2.5 accent-[#9daaf2] cursor-pointer"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#ff6a3d] dark:group-hover:text-[#ff6a3d] transition">{group.name}</span>
                          </label>
                          <button
                            onClick={() => toggleGroup(group.id)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-[#9daaf2]/20 rounded transition"
                          >
                            <svg
                              className={`w-3.5 h-3.5 transition-transform text-gray-500 dark:text-gray-400 ${expandedGroups.includes(group.id) ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        {expandedGroups.includes(group.id) && (
                          <div className="ml-6 mt-2 space-y-1.5">
                            {subgroups
                              .filter(sg => sg.group_id === group.id)
                              .map(subgroup => (
                                <label key={subgroup.id} className="flex items-center cursor-pointer group bg-gray-50 dark:bg-[#1a2238] border border-gray-200 dark:border-[#9daaf2] rounded px-2 py-1.5 hover:border-[#ff6a3d] dark:hover:border-[#ff6a3d] transition">
                                  <input
                                    type="checkbox"
                                    checked={selectedSubgroups.includes(subgroup.id)}
                                    onChange={() => handleCheckSubgroup(subgroup.id)}
                                    className="w-3 h-3 mr-2 accent-[#9daaf2] cursor-pointer"
                                  />
                                  <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-[#ff6a3d] dark:group-hover:text-[#ff6a3d] transition">{subgroup.name}</span>
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

        {/* Middle Panel - 60% - Posts */}
        <div className="w-[60%] h-[calc(100vh-64px)] overflow-y-auto p-6">
          <h2 className="font-bold text-2xl mb-6">Feed</h2>
          {posts.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-[#1a2238] rounded-lg border border-gray-200 dark:border-[#9daaf2]">
              <p className="text-gray-500 dark:text-gray-400">
                Select interests, groups, or subgroups to see posts
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post: Post) => {
                const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles
                const likes = postLikes[post.id] || []
                const comments = postComments[post.id] || []
                const isCommentsExpanded = expandedComments.includes(post.id)
                const visibleComments = isCommentsExpanded ? comments : comments.slice(0, 2)

                return (
                  <div key={post.id} className="bg-white dark:bg-[#1a2238] rounded-lg shadow border border-gray-200 dark:border-[#9daaf2] p-6">
                    {/* Post Header */}
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#9daaf2] to-[#ff6a3d] rounded-full mr-3"></div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{profile?.full_name || 'Unknown User'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(post.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>

                    {/* Like and Comment Buttons */}
                    <div className="flex items-center gap-4 pb-3 border-b border-gray-200 dark:border-[#9daaf2] mb-3">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                          likes.some(like => like.user_id === currentUserId)
                            ? 'bg-[#ff6a3d]/10 dark:bg-[#ff6a3d]/20 text-[#ff6a3d]'
                            : 'bg-gray-100 dark:bg-[#9daaf2]/20 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#9daaf2]/30'
                        }`}
                      >
                        <svg className="w-5 h-5" fill={likes.some(like => like.user_id === currentUserId) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm font-medium">Like</span>
                      </button>
                      <button
                        onClick={() => toggleCommentInput(post.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#9daaf2]/20 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#9daaf2]/30 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm font-medium">Comment</span>
                      </button>
                    </div>

                    {/* Comment Input */}
                    {showCommentInput.includes(post.id) && (
                      <div className="mb-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            value={newComment[post.id] || ''}
                            onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-[#9daaf2] rounded-lg bg-white dark:bg-[#1a2238] text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a3d]"
                          />
                          <button
                            onClick={() => handleComment(post.id)}
                            disabled={!newComment[post.id]?.trim()}
                            className="px-4 py-2 bg-[#9daaf2] hover:bg-[#ff6a3d] disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Likes Count */}
                    {likes.length > 0 && (
                      <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-5 h-5 text-[#ff6a3d]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{likes.length} {likes.length === 1 ? 'like' : 'likes'}</span>
                      </div>
                    )}

                    {/* Comments Section */}
                    {comments.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-[#9daaf2] pt-4 mt-4">
                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="font-medium">{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-3">
                          {visibleComments.map((comment) => {
                            const commentProfile = Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles
                            return (
                              <div key={comment.id} className="bg-gray-50 dark:bg-[#1a2238] rounded-lg p-3 border border-gray-200 dark:border-[#9daaf2]">
                                <div className="flex items-start gap-2">
                                  <div className="w-8 h-8 bg-gradient-to-br from-[#9daaf2] to-[#ff6a3d] rounded-full flex-shrink-0"></div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                      {commentProfile?.full_name || 'Unknown User'}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{comment.content}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      {new Date(comment.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Show More/Less Comments Button */}
                        {comments.length > 2 && (
                          <button
                            onClick={() => toggleComments(post.id)}
                            className="mt-3 text-sm text-[#ff6a3d] hover:text-[#9daaf2] font-medium transition"
                          >
                            {isCommentsExpanded
                              ? 'Show less comments'
                              : `Show ${comments.length - 2} more ${comments.length - 2 === 1 ? 'comment' : 'comments'}`
                            }
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Panel - 25% - Users & Messages */}
        <div className="w-1/4 bg-white dark:bg-[#1a2238] border-l border-gray-200 dark:border-[#9daaf2] h-[calc(100vh-64px)] flex flex-col">
          {/* Top Half - User List */}
          <div className="h-1/2 border-b border-gray-200 dark:border-[#9daaf2] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-[#9daaf2]">
              <h3 className="font-bold mb-3 text-gray-900 dark:text-white">Users</h3>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-[#9daaf2] rounded-lg bg-white dark:bg-[#1a2238] text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a3d]"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {filteredUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#9daaf2]/20 transition ${
                      selectedUser?.id === user.id ? 'bg-[#9daaf2]/10 dark:bg-[#9daaf2]/30' : ''
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#9daaf2] to-[#ff6a3d] rounded-full mr-3 flex-shrink-0"></div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.full_name}</p>
                    </div>
                    {unreadCounts[user.id] > 0 && (
                      <div className="ml-2 bg-[#ff6a3d] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {unreadCounts[user.id]}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Half - Chat Box */}
          <div className="h-1/2 flex flex-col">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-[#9daaf2] bg-gray-50 dark:bg-[#1a2238]">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#9daaf2] to-[#ff6a3d] rounded-full mr-3"></div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedUser.full_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-[#1a2238]">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender_id === currentUserId
                            ? 'bg-[#9daaf2] text-white'
                            : 'bg-white dark:bg-[#1a2238] text-gray-900 dark:text-white border border-gray-200 dark:border-[#9daaf2]'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_id === currentUserId ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-[#9daaf2] bg-white dark:bg-[#1a2238]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-[#9daaf2] rounded-lg bg-white dark:bg-[#1a2238] text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a3d]"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-[#9daaf2] hover:bg-[#ff6a3d] disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Select a user to start chatting
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
