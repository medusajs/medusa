import React from "react"
import { useAdminUpdateClaim } from "medusa-react"

type Props = {
  orderId: string
  claimId: string
}

const Claim = ({ orderId, claimId }: Props) => {
  const updateClaim = useAdminUpdateClaim(orderId)
  // ...

  const handleUpdate = () => {
    updateClaim.mutate({
      claim_id: claimId,
      no_notification: false
    }, {
      onSuccess: ({ order }) => {
        console.log(order.claims)
      }
    })
  }

  // ...
}

export default Claim
