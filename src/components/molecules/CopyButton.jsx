import React, { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { copyToClipboard } from "@/utils/fileUtils"

const CopyButton = ({ text, label = "Copy", className = "" }) => {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    const success = await copyToClipboard(text)
    
    if (success) {
      setCopied(true)
      toast.success("Link copied to clipboard!")
      
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } else {
      toast.error("Failed to copy link")
    }
  }
  
  return (
    <Button
      onClick={handleCopy}
      variant="ghost"
      size="icon"
      className={`relative overflow-hidden ${className}`}
      title={copied ? "Copied!" : label}
    >
      <motion.div
        initial={false}
        animate={{ 
          scale: copied ? [1, 1.2, 1] : 1,
          rotate: copied ? [0, 10, 0] : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <ApperIcon 
          name={copied ? "Check" : "Copy"} 
          size={16} 
          className={copied ? "text-accent-600" : "text-gray-500 hover:text-gray-700"} 
        />
      </motion.div>
    </Button>
  )
}

export default CopyButton