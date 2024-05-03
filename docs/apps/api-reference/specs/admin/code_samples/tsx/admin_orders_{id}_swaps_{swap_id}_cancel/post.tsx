import React from "react"
import { useAdminCancelSwap } from "medusa-react"

type Props = {
  orderId: string,
  swapId: string
}

const Swap = ({
  orderId,
  swapId
}: Props) => {
  const cancelSwap = useAdminCancelSwap(
    orderId
  )
  // ...

  const handleCancel = () => {
    cancelSwap.mutate(swapId, {
      onSuccess: ({ order }) => {
        console.log(order.swaps)
      }
    })
  }

  // ...
}

export default Swap
