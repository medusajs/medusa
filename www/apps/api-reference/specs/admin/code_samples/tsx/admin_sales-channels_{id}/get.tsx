import React from "react"
import { useAdminSalesChannel } from "medusa-react"

type Props = {
  salesChannelId: string
}

const SalesChannel = ({ salesChannelId }: Props) => {
  const {
    sales_channel,
    isLoading,
  } = useAdminSalesChannel(salesChannelId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {sales_channel && <span>{sales_channel.name}</span>}
    </div>
  )
}

export default SalesChannel
