import React from "react"
import { useAdminDeleteSalesChannel } from "medusa-react"

type Props = {
  salesChannelId: string
}

const SalesChannel = ({ salesChannelId }: Props) => {
  const deleteSalesChannel = useAdminDeleteSalesChannel(
    salesChannelId
  )
  // ...

  const handleDelete = () => {
    deleteSalesChannel.mutate(void 0, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default SalesChannel
