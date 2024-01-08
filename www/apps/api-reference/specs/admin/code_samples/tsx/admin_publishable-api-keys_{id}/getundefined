import React from "react"
import {
  useAdminPublishableApiKey,
} from "medusa-react"

type Props = {
  publishableApiKeyId: string
}

const PublishableApiKey = ({
  publishableApiKeyId
}: Props) => {
  const { publishable_api_key, isLoading } =
    useAdminPublishableApiKey(
      publishableApiKeyId
    )


  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {publishable_api_key && <span>{publishable_api_key.title}</span>}
    </div>
  )
}

export default PublishableApiKey
