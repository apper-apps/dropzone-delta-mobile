import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
const variants = {
    default: "bg-gradient-to-r from-primary-900 to-primary-600 text-white hover:from-primary-800 hover:to-primary-500 focus-visible:ring-primary-500 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary-900/20",
    outline: "border border-primary-300 bg-white text-primary-700 hover:bg-primary-50 hover:border-primary-400 focus-visible:ring-primary-500",
    ghost: "text-primary-700 hover:bg-primary-100 focus-visible:ring-primary-500",
    success: "bg-gradient-to-r from-primary-700 to-primary-500 text-white hover:from-primary-800 hover:to-primary-600 focus-visible:ring-primary-500 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary-700/20",
    danger: "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 focus-visible:ring-red-500 transform hover:scale-[1.02] active:scale-[0.98]"
  }
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10"
  }
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button