import React from "react"
import {
  useAdminAddLocationToSalesChannel
} from "medusa-react"

type Props = {
  salesChannelId: string
}

const SalesChannel = ({ salesChannelId }: Props) => {
  const addLocation = useAdminAddLocationToSalesChannel()
  // ...

  const handleAddLocation = (locationId: string) => {
    addLocation.mutate({
      sales_channel_id: salesChannelId,
      location_id: locationId
    }, {
      onSuccess: ({ sales_channel }) => {
        console.log(sales_channel.locations)
      }
    })
  }

  // ...
}

export default SalesChannel
