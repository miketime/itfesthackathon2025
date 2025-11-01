import Link from 'next/link'

export default function Profile() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Link
            href="/"
            className="text-blue-600 hover:underline"
          >
            Home
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full mb-4"></div>
            <h2 className="text-2xl font-semibold mb-2">Your Name</h2>
            <p className="text-gray-600 dark:text-gray-400">your.email@company.com</p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold mb-4">About</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Add authentication to enable personalized profiles.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
