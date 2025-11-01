'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Post {
  id: string
  content: string
  created_at: string
  user_id: string
  author_name: string
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Company Feed</h1>
          <Link
            href="/"
            className="text-blue-600 hover:underline"
          >
            Home
          </Link>
        </div>

        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-lg mb-4">No posts yet!</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Set up your Supabase database to start sharing posts.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <p className="font-semibold mb-2">{post.author_name}</p>
                <p className="mb-2">{post.content}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
