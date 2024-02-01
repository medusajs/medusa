import React from "react"
import { PublishableApiKey } from "@medusajs/medusa"
import { useAdminPublishableApiKeys } from "medusa-react"

const PublishableApiKeys = () => {
  const { publishable_api_keys, isLoading } =
    useAdminPublishableApiKeys()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {publishable_api_keys && !publishable_api_keys.length && (
        <span>No Publishable API Keys</span>
      )}
      {publishable_api_keys &&
        publishable_api_keys.length > 0 && (
        <ul>
          {publishable_api_keys.map(
            (publishableApiKey: PublishableApiKey) => (
              <li key={publishableApiKey.id}>
                {publishableApiKey.title}
              </li>
            )
          )}
        </ul>
      )}
    </div>
  )
}

export default PublishableApiKeys
