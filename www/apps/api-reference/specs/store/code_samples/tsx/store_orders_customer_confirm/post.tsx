import React from "react"
import { useGrantOrderAccess } from "medusa-react"

const ClaimOrder = () => {
  const confirmOrderRequest = useGrantOrderAccess()

  const handleOrderRequestConfirmation = (
    token: string
  ) => {
    confirmOrderRequest.mutate({
      token
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
