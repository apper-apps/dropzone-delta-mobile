import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { uploadService } from "@/services/api/uploadService";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import FileTypeIcon from "@/components/molecules/FileTypeIcon";
import CopyButton from "@/components/molecules/CopyButton";
import Button from "@/components/atoms/Button";
import { formatFileSize } from "@/utils/fileUtils";

const UploadHistory = ({ refreshTrigger }) => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const loadHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await uploadService.getUploadHistory()
      setHistory(data)
    } catch (err) {
      setError(err.message || "Failed to load upload history")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadHistory()
  }, [refreshTrigger])
  
const handleDelete = async (id) => {
    try {
      await uploadService.deleteUpload(id)
      setHistory(prev => prev.filter(item => item.id !== id))
      toast.success("Upload removed from history")
    } catch (err) {
      toast.error("Failed to remove upload")
    }
  }
  
  const handleClearHistory = async () => {
    try {
      await uploadService.clearHistory()
      setHistory([])
      toast.success("History cleared successfully")
    } catch (err) {
      toast.error("Failed to clear history")
    }
  }
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <Loading />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <Error message={error} onRetry={loadHistory} />
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Uploads
        </h2>
        
        {history.length > 0 && (
          <Button
            onClick={handleClearHistory}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-red-600"
          >
            <ApperIcon name="Trash2" size={16} className="mr-2" />
            Clear History
          </Button>
        )}
      </div>
      
      <div className="p-6">
        {history.length === 0 ? (
          <Empty 
            title="No uploads yet"
            description="Your uploaded files will appear here for easy access and sharing"
            action={{
              label: "Start Uploading",
              onClick: () => window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          />
        ) : (
          <div className="space-y-3">
<AnimatePresence mode="popLayout">
              {history.map((upload, index) => (
                <motion.div
                  key={upload.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <FileTypeIcon fileName={upload.Name} />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors duration-200">
                        {upload.Name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {formatFileSize(upload.size_c)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {format(new Date(upload.uploaded_at_c), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <CopyButton 
                      text={upload.share_link_c}
                      label="Copy share link"
                      className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                    />
                    
                    <Button
                      onClick={() => handleDelete(upload.id)}
                      variant="ghost"
                      size="icon"
                      className="opacity-70 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500"
                      title="Remove from history"
                    >
                      <ApperIcon name="X" size={16} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadHistory