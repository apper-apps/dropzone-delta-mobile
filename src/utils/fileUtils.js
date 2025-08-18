export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B"
  
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

export const formatUploadSpeed = (bytesPerSecond) => {
  if (bytesPerSecond === 0) return "0 B/s"
  
  const k = 1024
  const sizes = ["B/s", "KB/s", "MB/s", "GB/s"]
  const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k))
  
  return parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

export const getFileType = (fileName) => {
  const extension = fileName.split(".").pop()?.toLowerCase()
  
  const imageTypes = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"]
  const videoTypes = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"]
  const audioTypes = ["mp3", "wav", "flac", "aac", "ogg", "wma"]
  const documentTypes = ["pdf", "doc", "docx", "txt", "rtf", "odt"]
  const spreadsheetTypes = ["xls", "xlsx", "csv", "ods"]
  const presentationTypes = ["ppt", "pptx", "odp"]
  const archiveTypes = ["zip", "rar", "7z", "tar", "gz"]
  
  if (imageTypes.includes(extension)) return "image"
  if (videoTypes.includes(extension)) return "video"
  if (audioTypes.includes(extension)) return "audio"
  if (documentTypes.includes(extension)) return "document"
  if (spreadsheetTypes.includes(extension)) return "spreadsheet"
  if (presentationTypes.includes(extension)) return "presentation"
  if (archiveTypes.includes(extension)) return "archive"
  
  return "file"
}

export const generateFileId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const generateShareableLink = (fileId) => {
  return `https://dropzone.app/share/${fileId}`
}

export const validateFile = (file) => {
  const maxSize = 100 * 1024 * 1024 // 100MB
  const errors = []
  
  if (file.size > maxSize) {
    errors.push("File size exceeds 100MB limit")
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
      const successful = document.execCommand("copy")
      document.body.removeChild(textArea)
      return successful
    } catch (err) {
      document.body.removeChild(textArea)
      return false
    }
  }
}