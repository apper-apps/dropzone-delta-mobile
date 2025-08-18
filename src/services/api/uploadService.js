import uploadHistoryData from "@/services/mockData/uploadHistory.json"
import { generateFileId, generateShareableLink } from "@/utils/fileUtils"

let uploadHistory = [...uploadHistoryData]

export const uploadService = {
  async getUploadHistory() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...uploadHistory].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
  },

  async uploadFile(file, onProgress) {
    return new Promise((resolve, reject) => {
      const fileId = generateFileId()
      let uploadedSize = 0
      const totalSize = file.size
      const chunkSize = Math.max(totalSize / 100, 1024) // Simulate chunked upload
      let lastTime = Date.now()
      
      const upload = () => {
        const currentTime = Date.now()
        const timeElapsed = currentTime - lastTime
        const bytesThisChunk = Math.min(chunkSize, totalSize - uploadedSize)
        
        uploadedSize += bytesThisChunk
        const progress = (uploadedSize / totalSize) * 100
        const speed = timeElapsed > 0 ? (bytesThisChunk / timeElapsed) * 1000 : 0
        
        onProgress({
          progress: Math.min(progress, 100),
          uploadedSize,
          totalSize,
          speed
        })
        
        lastTime = currentTime
        
        if (uploadedSize >= totalSize) {
          // Upload completed
          const uploadRecord = {
            Id: Math.max(...uploadHistory.map(u => u.Id)) + 1,
            name: file.name,
            size: file.size,
            type: file.type,
            status: "completed",
            shareLink: generateShareableLink(fileId),
            uploadedAt: new Date().toISOString()
          }
          
          uploadHistory.unshift(uploadRecord)
          
          // Keep only last 50 uploads
          if (uploadHistory.length > 50) {
            uploadHistory = uploadHistory.slice(0, 50)
          }
          
          resolve(uploadRecord)
        } else {
          // Continue uploading
          const delay = Math.random() * 50 + 25 // Random delay between 25-75ms
          setTimeout(upload, delay)
        }
      }
      
      // Start upload after small delay
      setTimeout(upload, 100)
    })
  },

  async deleteUpload(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    uploadHistory = uploadHistory.filter(upload => upload.Id !== id)
    return true
  },

  async clearHistory() {
    await new Promise(resolve => setTimeout(resolve, 300))
    uploadHistory = []
    return true
  }
}