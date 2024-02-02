import React from "react"
import { useAdminCancelClaimFulfillment } from "medusa-react"

type Props = {
  orderId: string
  claimId: string
}

const Claim = ({ orderId, claimId }: Props) => {
  const cancelFulfillment = useAdminCancelClaimFulfillment(
    orderId
  )
  // ...

  const handleCancel = (fulfillmentId: string) => {
    cancelFulfillment.mutate({
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
