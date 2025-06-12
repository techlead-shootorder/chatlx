import React from 'react'

const ChatAreaSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-white p-6">
      {/* Heading Skeleton */}
      <div className="w-3/4 h-12 bg-gray-700 animate-pulse rounded-md"></div>

      {/* Subtext Skeleton */}
      <div className="mt-3 w-2/3 h-6 bg-gray-600 animate-pulse rounded-md"></div>

      {/* Pills Skeleton */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="w-24 h-8 bg-gray-700 animate-pulse rounded-full"></div>
        ))}
      </div>
    </div>
  )
}

export default ChatAreaSkeleton