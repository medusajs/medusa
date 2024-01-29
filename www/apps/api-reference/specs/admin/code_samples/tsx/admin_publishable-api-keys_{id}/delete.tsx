import React from "react"
import { useAdminDeletePublishableApiKey } from "medusa-react"

type Props = {
  publishableApiKeyId: string
}

const PublishableApiKey = ({
  publishableApiKeyId
}: Props) => {
  const deleteKey = useAdminDeletePublishableApiKey(
    publishableApiKeyId
  )
  // ...

  const handleDelete = () => {
    deleteKey.mutate(void 0, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default PublishableApiKey
