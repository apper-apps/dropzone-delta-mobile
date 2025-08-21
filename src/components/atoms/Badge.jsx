import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Badge = forwardRef(({ className, variant = "default", size = "default", children, ...props }, ref) => {
  const baseClasses = "inline-flex items-center rounded-full font-medium"
  
const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary-100 to-primary-50 text-primary-800 border border-primary-200 shadow-sm",
    success: "bg-gradient-to-r from-primary-200 to-primary-100 text-primary-800 border border-primary-300 shadow-sm",
    warning: "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border border-amber-200",
    error: "bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200",
    info: "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200"
  }
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  }
  
  return (
    <span
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = "Badge"

export default Badge