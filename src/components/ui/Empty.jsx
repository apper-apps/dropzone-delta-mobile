import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "No uploads yet", 
  description = "Your uploaded files will appear here", 
  action,
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 ${className}`}
    >
<div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
        <ApperIcon name="Upload" size={24} className="text-purple-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {action && (
        <Button 
          onClick={action.onClick}
          className="inline-flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>{action.label}</span>
        </Button>
      )}
    </motion.div>
  )
}

export default Empty