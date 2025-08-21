import React from "react"
import ApperIcon from "@/components/ApperIcon"
import { getFileType } from "@/utils/fileUtils"

const FileTypeIcon = ({ fileName, className = "w-10 h-10" }) => {
const fileType = getFileType(fileName)
  
const typeIcons = {
    image: { icon: "Image", bg: "bg-gradient-to-br from-pink-100 to-pink-50", color: "text-pink-600" },
    video: { icon: "Video", bg: "bg-gradient-to-br from-purple-100 to-purple-50", color: "text-purple-600" },
    audio: { icon: "Music", bg: "bg-gradient-to-br from-indigo-100 to-indigo-50", color: "text-indigo-600" },
    document: { icon: "FileText", bg: "bg-gradient-to-br from-blue-100 to-blue-50", color: "text-blue-600" },
    spreadsheet: { icon: "Sheet", bg: "bg-gradient-to-br from-primary-100 to-primary-50", color: "text-primary-600" },
    presentation: { icon: "Presentation", bg: "bg-gradient-to-br from-orange-100 to-orange-50", color: "text-orange-600" },
    archive: { icon: "Archive", bg: "bg-gradient-to-br from-gray-100 to-gray-50", color: "text-gray-600" },
    file: { icon: "File", bg: "bg-gradient-to-br from-gray-100 to-gray-50", color: "text-gray-600" }
  }
  
  const typeConfig = typeIcons[fileType] || typeIcons.file
  
  return (
    <div className={`${className} rounded-lg ${typeConfig.bg} flex items-center justify-center border border-white/50 shadow-sm`}>
      <ApperIcon 
        name={typeConfig.icon} 
        size={className.includes("w-10") ? 20 : 16} 
        className={typeConfig.color} 
      />
    </div>
  )
}

export default FileTypeIcon