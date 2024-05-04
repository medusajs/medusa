import React from "react"
import { useAdminCancelClaim } from "medusa-react"

type Props = {
  orderId: string
  claimId: string
}

const Claim = ({ orderId, claimId }: Props) => {
  const cancelClaim = useAdminCancelClaim(orderId)
  // ...

  const handleCancel = () => {
    cancelClaim.mutate(claimId)
  }

  // ...
}

export default Claim
