import React from "react"
import { useAdminRevokePublishableApiKey } from "medusa-react"

type Props = {
  publishableApiKeyId: string
}

const PublishableApiKey = ({
  publishableApiKeyId
}: Props) => {
  const revokeKey = useAdminRevokePublishableApiKey(
    publishableApiKeyId
  )
  // ...

  const handleRevoke = () => {
    revokeKey.mutate(void 0, {
      onSuccess: ({ publishable_api_key }) => {
        console.log(publishable_api_key.revoked_at)
      }
    })
  }

  // ...
}

export default PublishableApiKey
