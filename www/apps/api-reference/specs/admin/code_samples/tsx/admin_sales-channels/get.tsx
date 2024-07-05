import React from "react"
import { useAdminSalesChannels } from "medusa-react"

const SalesChannels = () => {
  const { sales_channels, isLoading } = useAdminSalesChannels()

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
