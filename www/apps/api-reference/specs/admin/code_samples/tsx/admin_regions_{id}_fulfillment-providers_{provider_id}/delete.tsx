import React from "react"
import {
  useAdminRegionDeleteFulfillmentProvider
} from "medusa-react"

type Props = {
  regionId: string
}

const Region = ({
  regionId
}: Props) => {
  const removeFulfillmentProvider =
    useAdminRegionDeleteFulfillmentProvider(regionId)
  // ...

  const handleRemoveFulfillmentProvider = (
    providerId: string
  ) => {
    removeFulfillmentProvider.mutate(providerId, {
      onSuccess: ({ region }) => {
        console.log(region.fulfillment_providers)
      }
    })
  }

  // ...
}

export default Region
