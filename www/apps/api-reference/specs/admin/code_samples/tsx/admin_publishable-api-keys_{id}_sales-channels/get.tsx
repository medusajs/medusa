import React from "react"
import {
  useAdminPublishableApiKeySalesChannels,
} from "medusa-react"

type Props = {
  publishableApiKeyId: string
}

const SalesChannels = ({
  publishableApiKeyId
}: Props) => {
  const { sales_channels, isLoading } =
    useAdminPublishableApiKeySalesChannels(
      publishableApiKeyId
    )

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {sales_channels && !sales_channels.length && (
        <span>No Sales Channels</span>
      )}
      {sales_channels && sales_channels.length > 0 && (
        <ul>
          {sales_channels.map((salesChannel) => (
            <li key={salesChannel.id}>{salesChannel.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SalesChannels
