import React from "react"
import { useAdminCreateClaimShipment } from "medusa-react"

type Props = {
  orderId: string
  claimId: string
}

const Claim = ({ orderId, claimId }: Props) => {
  const createShipment = useAdminCreateClaimShipment(orderId)
  // ...

  const handleCreateShipment = (fulfillmentId: string) => {
    createShipment.mutate({
      claim_id: claimId,
      fulfillment_id: fulfillmentId,
    }, {
      onSuccess: ({ order }) => {
        console.log(order.claims)
      }
    })
  }

  // ...
}

export default Claim
