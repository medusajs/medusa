import React from "react"
import { useAdminUpdateSalesChannel } from "medusa-react"

type Props = {
  salesChannelId: string
}

const SalesChannel = ({ salesChannelId }: Props) => {
  const updateSalesChannel = useAdminUpdateSalesChannel(
    salesChannelId
  )
  // ...

  const handleUpdate = (
    is_disabled: boolean
  ) => {
    updateSalesChannel.mutate({
      is_disabled,
    }, {
      onSuccess: ({ sales_channel }) => {
        console.log(sales_channel.is_disabled)
      }
    })
  }

  // ...
}

export default SalesChannel
