import React from "react"
import { useAdminUploadProtectedFile } from "medusa-react"

const UploadFile = () => {
  const uploadFile = useAdminUploadProtectedFile()
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
