import { generateFileId, generateShareableLink } from "@/utils/fileUtils"

export const uploadService = {
  async getUploadHistory() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "size_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "share_link_c" } },
          { field: { Name: "uploaded_at_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          {
            fieldName: "uploaded_at_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      }
      
      const response = await apperClient.fetchRecords("upload_history_c", params)
      
      if (!response.success) {
        console.error("Error fetching upload history:", response.message)
        throw new Error(response.message)
      }
      
      if (!response.data || response.data.length === 0) {
        return []
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching upload history:", error.response.data.message)
      } else {
        console.error("Error fetching upload history:", error)
      }
      throw error
    }
  },

  async uploadFile(file, onProgress) {
    return new Promise((resolve, reject) => {
      const fileId = generateFileId()
      let uploadedSize = 0
      const totalSize = file.size
      const chunkSize = Math.max(totalSize / 100, 1024) // Simulate chunked upload
      let lastTime = Date.now()
      
      const upload = async () => {
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
          // Upload completed - save to database
          try {
            const { ApperClient } = window.ApperSDK
            const apperClient = new ApperClient({
              apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
              apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
            })
            
            const uploadRecord = {
              Name: file.name,
              size_c: file.size,
              type_c: file.type,
              status_c: "completed",
              share_link_c: generateShareableLink(fileId),
              uploaded_at_c: new Date().toISOString(),
              Tags: ""
            }
            
            const params = {
              records: [uploadRecord]
            }
            
            const response = await apperClient.createRecord("upload_history_c", params)
            
            if (!response.success) {
              console.error("Error creating upload record:", response.message)
              reject(new Error(response.message))
              return
            }
            
            if (response.results) {
              const successfulRecords = response.results.filter(result => result.success)
              const failedRecords = response.results.filter(result => !result.success)
              
              if (failedRecords.length > 0) {
                console.error(`Failed to create upload records ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
                failedRecords.forEach(record => {
                  if (record.message) console.error(record.message)
                })
              }
              
              if (successfulRecords.length > 0) {
                resolve(successfulRecords[0].data)
              } else {
                reject(new Error("Failed to create upload record"))
              }
            }
          } catch (error) {
            if (error?.response?.data?.message) {
              console.error("Error creating upload record:", error.response.data.message)
            } else {
              console.error("Error creating upload record:", error)
            }
            reject(error)
          }
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
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: [id]
      }
      
      const response = await apperClient.deleteRecord("upload_history_c", params)
      
      if (!response.success) {
        console.error("Error deleting upload:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete uploads ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message)
          })
          throw new Error("Failed to delete upload")
        }
        
        return true
      }
      
      return true
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting upload:", error.response.data.message)
      } else {
        console.error("Error deleting upload:", error)
      }
      throw error
    }
  },

  async clearHistory() {
    try {
      // First fetch all records to get their IDs
      const history = await this.getUploadHistory()
      
      if (history.length === 0) {
        return true
      }
      
      const recordIds = history.map(record => record.Id)
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: recordIds
      }
      
      const response = await apperClient.deleteRecord("upload_history_c", params)
      
      if (!response.success) {
        console.error("Error clearing history:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to clear history ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message)
          })
        }
      }
      
      return true
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error clearing history:", error.response.data.message)
      } else {
        console.error("Error clearing history:", error)
      }
      throw error
    }
  }
}