import React from "react"
import { useAdminCreatePresignedDownloadUrl } from "medusa-react"

const Image = () => {
  const createPresignedUrl = useAdminCreatePresignedDownloadUrl()
  // ...

  const handlePresignedUrl = (fileKey: string) => {
    createPresignedUrl.mutate({
      file_key: fileKey
    }, {
      onSuccess: ({ download_url }) => {
        console.log(download_url)
      }
    })
  }

  // ...
}

export default Image
