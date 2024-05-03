import React from "react"
import { useAdminUpdatePublishableApiKey } from "medusa-react"

type Props = {
  publishableApiKeyId: string
}

const PublishableApiKey = ({
  publishableApiKeyId
}: Props) => {
  const updateKey = useAdminUpdatePublishableApiKey(
    publishableApiKeyId
  )
  // ...

  const handleUpdate = (title: string) => {
    updateKey.mutate({
      title,
    }, {
      onSuccess: ({ publishable_api_key }) => {
        console.log(publishable_api_key.id)
      }
    })
  }

  // ...
}

export default PublishableApiKey
