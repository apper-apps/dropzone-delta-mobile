import React from "react"
import { motion } from "framer-motion"

const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
{/* Drop Zone Skeleton */}
      <div className="bg-gradient-to-br from-primary-25 to-gray-100 border-2 border-dashed border-primary-200 rounded-xl p-12 mb-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mx-auto mb-4"></div>
          <div className="h-6 bg-primary-100 rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-primary-50 rounded w-32 mx-auto"></div>
        </div>
      </div>

      {/* Upload History Skeleton */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Loading