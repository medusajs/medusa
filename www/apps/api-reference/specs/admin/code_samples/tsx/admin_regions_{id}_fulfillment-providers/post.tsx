import React from "react"
import {
  useAdminRegionAddFulfillmentProvider
} from "medusa-react"

type Props = {
  regionId: string
}

const Region = ({
  regionId
}: Props) => {
  const addFulfillmentProvider =
    useAdminRegionAddFulfillmentProvider(regionId)
  // ...

  const handleAddFulfillmentProvider = (
    providerId: string
  ) => {
    addFulfillmentProvider.mutate({
      provider_id: providerId
    }, {
      onSuccess: ({ region }) => {
        console.log(region.fulfillment_providers)
      }
    })
  }

  // ...
}

export default Region
