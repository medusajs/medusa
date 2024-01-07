import React from "react"
import { useAdminCancelSwapFulfillment } from "medusa-react"

type Props = {
  orderId: string,
  swapId: string
}

const Swap = ({
  orderId,
  swapId
}: Props) => {
  const cancelFulfillment = useAdminCancelSwapFulfillment(
    orderId
  )
  // ...

  const handleCancelFulfillment = (
    fulfillmentId: string
  ) => {
    cancelFulfillment.mutate({
      swap_id: swapId,
      fulfillment_id: fulfillmentId,
    })
  }

  // ...
}

export default Swap
