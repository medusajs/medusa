import React from "react"
import { useAdminFulfillClaim } from "medusa-react"

type Props = {
  orderId: string
  claimId: string
}

const Claim = ({ orderId, claimId }: Props) => {
  const fulfillClaim = useAdminFulfillClaim(orderId)
  // ...

  const handleFulfill = () => {
    fulfillClaim.mutate({
      claim_id: claimId,
    }, {
      onSuccess: ({ order }) => {
        console.log(order.claims)
      }
    })
  }

  // ...
}

export default Claim
