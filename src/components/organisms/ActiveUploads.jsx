import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import ProgressBar from "@/components/atoms/ProgressBar"
import FileTypeIcon from "@/components/molecules/FileTypeIcon"
import { formatFileSize, formatUploadSpeed } from "@/utils/fileUtils"

const ActiveUploads = ({ uploads = [] }) => {
  if (uploads.length === 0) {
    return null
  }
  
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Active Uploads ({uploads.length})
      </h2>
      
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {uploads.map((upload, index) => (
            <motion.div
              key={upload.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
<FileTypeIcon fileName={upload.name} className="w-12 h-12 flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate pr-2">
{upload.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 flex-shrink-0">
                      <span>{Math.round(upload.progress)}%</span>
                      {upload.speed > 0 && (
                        <>
                          <span>•</span>
                          <span>{formatUploadSpeed(upload.speed)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-2">
                    <ProgressBar 
                      progress={upload.progress} 
                      showPercentage={false}
                      className="flex-1"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
{formatFileSize(upload.uploadedSize || 0)} of {formatFileSize(upload.totalSize)}
                    </span>
                    
                    {upload.status === "uploading" && (
                      <div className="flex items-center space-x-1">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <ApperIcon name="Loader2" size={12} className="text-primary-600" />
                        </motion.div>
                        <span className="text-primary-600">Uploading...</span>
                      </div>
                    )}
                    
                    {upload.status === "completed" && (
                      <div className="flex items-center space-x-1">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 rounded-full bg-accent-500 flex items-center justify-center"
                        >
                          <ApperIcon name="Check" size={8} className="text-white" />
                        </motion.div>
                        <span className="text-accent-600 font-medium">Complete</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ActiveUploads