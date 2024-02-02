import React from "react"
import { useAdminUploadFile } from "medusa-react"

const UploadFile = () => {
  const uploadFile = useAdminUploadFile()
  // ...

  const handleFileUpload = (file: File) => {
    uploadFile.mutate(file, {
      onSuccess: ({ uploads }) => {
        console.log(uploads[0].key)
      }
    })
  }

  // ...
}

export default UploadFile
