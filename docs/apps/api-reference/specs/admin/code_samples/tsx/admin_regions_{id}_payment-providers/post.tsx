import React from "react"
import {
  useAdminRegionAddPaymentProvider
} from "medusa-react"

type Props = {
  regionId: string
}

const Region = ({
  regionId
}: Props) => {
  const addPaymentProvider =
    useAdminRegionAddPaymentProvider(regionId)
  // ...

  const handleAddPaymentProvider = (
    providerId: string
  ) => {
    addPaymentProvider.mutate({
      provider_id: providerId
    }, {
      onSuccess: ({ region }) => {
        console.log(region.payment_providers)
      }
    })
  }

  // ...
}

export default Region
