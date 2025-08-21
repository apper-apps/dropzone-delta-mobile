import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { validateFile } from "@/utils/fileUtils"

const DropZone = ({ onFilesSelected, disabled = false }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)
  
  const handleDragOver = (e) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }
  
  const handleDragLeave = (e) => {
    e.preventDefault()
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false)
    }
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }
  
  const handleFileInput = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
    
    // Reset input
    e.target.value = ""
  }
  
  const handleFiles = (files) => {
    const validFiles = []
    const errors = []
    
    files.forEach(file => {
      const validation = validateFile(file)
      if (validation.isValid) {
        validFiles.push(file)
      } else {
        errors.push(`${file.name}: ${validation.errors.join(", ")}`)
      }
    })
    
    if (errors.length > 0) {
      errors.forEach(error => {
        toast.error(error)
      })
    }
    
    if (validFiles.length > 0) {
      onFilesSelected(validFiles)
    }
  }
  
  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  return (
    <motion.div
className={`
        relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
        ${isDragOver 
          ? "border-primary-500 bg-gradient-to-br from-primary-100 to-primary-50 shadow-xl shadow-primary-500/20 scale-[1.02]" 
          : "border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-primary-400 hover:bg-gradient-to-br hover:from-primary-50 hover:to-primary-25"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileDialog}
      whileHover={!disabled ? { scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />
      
      <motion.div
        animate={{ 
          scale: isDragOver ? 1.1 : 1,
          rotate: isDragOver ? 5 : 0
        }}
        transition={{ duration: 0.2 }}
className={`
          w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300
          ${isDragOver 
            ? "bg-gradient-to-br from-primary-700 to-primary-800 shadow-2xl shadow-primary-700/40" 
            : "bg-gradient-to-br from-primary-100 to-primary-200 border border-primary-300 shadow-lg shadow-primary-100/50"
          }
        `}
      >
        <ApperIcon 
          name={isDragOver ? "Download" : "Upload"} 
          size={28} 
          className={isDragOver ? "text-white" : "text-primary-700"} 
        />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {isDragOver ? "Drop your files here" : "Drag & drop files here"}
      </h3>
      
      <p className="text-gray-600 mb-6">
        or click to browse your files
      </p>
      
<div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Shield" size={16} className="text-primary-500" />
          <span>Up to 100MB per file</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Zap" size={16} className="text-primary-600" />
          <span>Instant shareable links</span>
        </div>
      </div>
      
      {!disabled && (
        <div className="mt-6">
          <Button 
            onClick={(e) => {
              e.stopPropagation()
              openFileDialog()
            }}
            className="px-6"
          >
            <ApperIcon name="FolderOpen" size={16} className="mr-2" />
            Choose Files
          </Button>
        </div>
      )}
    </motion.div>
  )
}

export default DropZone