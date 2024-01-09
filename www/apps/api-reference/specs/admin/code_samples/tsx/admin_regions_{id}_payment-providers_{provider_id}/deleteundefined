import React from "react"
import {
  useAdminRegionDeletePaymentProvider
} from "medusa-react"

type Props = {
  regionId: string
}

const Region = ({
  regionId
}: Props) => {
  const removePaymentProvider =
    useAdminRegionDeletePaymentProvider(regionId)
  // ...

  const handleRemovePaymentProvider = (
    providerId: string
  ) => {
    removePaymentProvider.mutate(providerId, {
      onSuccess: ({ region }) => {
        console.log(region.payment_providers)
      }
    })
  }

  // ...
}

export default Region
