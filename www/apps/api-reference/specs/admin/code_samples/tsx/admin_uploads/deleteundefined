import React from "react"
import { useAdminDeleteFile } from "medusa-react"

const Image = () => {
  const deleteFile = useAdminDeleteFile()
  // ...

  const handleDeleteFile = (fileKey: string) => {
    deleteFile.mutate({
      file_key: fileKey
    }, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default Image
