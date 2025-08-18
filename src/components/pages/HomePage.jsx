import React, { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import DropZone from "@/components/organisms/DropZone"
import ActiveUploads from "@/components/organisms/ActiveUploads"
import UploadHistory from "@/components/organisms/UploadHistory"
import { uploadService } from "@/services/api/uploadService"
import { generateFileId } from "@/utils/fileUtils"

const HomePage = () => {
  const [activeUploads, setActiveUploads] = useState([])
  const [historyRefresh, setHistoryRefresh] = useState(0)
  
  const handleFilesSelected = useCallback(async (files) => {
    const newUploads = files.map(file => ({
      id: generateFileId(),
      name: file.name,
      size: file.size,
      totalSize: file.size,
      uploadedSize: 0,
      progress: 0,
      speed: 0,
      status: "uploading"
    }))
    
    // Add new uploads to active list
    setActiveUploads(prev => [...prev, ...newUploads])
    
    // Process each upload
    newUploads.forEach(async (uploadData, index) => {
      const file = files[index]
      
      try {
        await uploadService.uploadFile(file, (progressData) => {
          setActiveUploads(prev => prev.map(upload => 
            upload.id === uploadData.id 
              ? { 
                  ...upload, 
                  progress: progressData.progress,
                  uploadedSize: progressData.uploadedSize,
                  speed: progressData.speed
                }
              : upload
          ))
        })
        
        // Mark as completed
        setActiveUploads(prev => prev.map(upload => 
          upload.id === uploadData.id 
            ? { ...upload, status: "completed", progress: 100 }
            : upload
        ))
        
        toast.success(`${file.name} uploaded successfully!`)
        
        // Remove from active uploads after delay
        setTimeout(() => {
          setActiveUploads(prev => prev.filter(upload => upload.id !== uploadData.id))
        }, 2000)
        
        // Refresh history
        setHistoryRefresh(prev => prev + 1)
        
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`)
        setActiveUploads(prev => prev.filter(upload => upload.id !== uploadData.id))
      }
    })
  }, [])
  
  const hasActiveUploads = activeUploads.length > 0
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-lg">
                <ApperIcon name="Upload" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
                  DropZone
                </h1>
                <p className="text-gray-600 text-sm">Fast file sharing made simple</p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Zap" size={16} className="text-primary-500" />
                <span>Instant Links</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Shield" size={16} className="text-accent-500" />
                <span>Secure Upload</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Drop Zone */}
          <div className="mb-8">
            <DropZone 
              onFilesSelected={handleFilesSelected}
              disabled={hasActiveUploads}
            />
          </div>
          
          {/* Active Uploads */}
          <ActiveUploads uploads={activeUploads} />
          
          {/* Upload History */}
          <UploadHistory refreshTrigger={historyRefresh} />
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>Drag, drop, and share your files instantly with DropZone</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage