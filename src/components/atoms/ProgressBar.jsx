import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

const ProgressBar = ({ 
  progress = 0, 
  className = "",
  showPercentage = true,
  size = "default",
  variant = "default"
}) => {
  const heights = {
    sm: "h-1",
    default: "h-2",
    lg: "h-3"
  }
  
  const variants = {
    default: {
      bg: "bg-gray-200",
      fill: "bg-gradient-to-r from-primary-900 to-primary-700"
    },
    success: {
      bg: "bg-gray-200",
      fill: "bg-gradient-to-r from-accent-600 to-accent-500"
    }
  }
  
  const currentVariant = variants[variant]
  
  return (
    <div className={cn("w-full", className)}>
      <div className={cn(
        "w-full rounded-full overflow-hidden",
        heights[size],
        currentVariant.bg
      )}>
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "h-full rounded-full transition-all duration-300",
            currentVariant.fill
          )}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-600">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  )
}

export default ProgressBar