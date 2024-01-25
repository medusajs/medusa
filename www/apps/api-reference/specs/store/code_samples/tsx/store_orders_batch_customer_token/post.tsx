import React from "react"
import { useRequestOrderAccess } from "medusa-react"

const ClaimOrder = () => {
  const claimOrder = useRequestOrderAccess()

  const handleClaimOrder = (
    orderIds: string[]
  ) => {
    claimOrder.mutate({
      order_ids: orderIds
    }, {
      onSuccess: () => {
        // successful
      },
      onError: () => {
        // an error occurred.
      }
    })
  }

  // ...
}

export default ClaimOrder
