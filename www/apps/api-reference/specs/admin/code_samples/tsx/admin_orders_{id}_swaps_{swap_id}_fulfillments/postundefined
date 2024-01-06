import React from "react"
import { useAdminFulfillSwap } from "medusa-react"

type Props = {
  orderId: string,
  swapId: string
}

const Swap = ({
  orderId,
  swapId
}: Props) => {
  const fulfillSwap = useAdminFulfillSwap(
    orderId
  )
  // ...

  const handleFulfill = () => {
    fulfillSwap.mutate({
      swap_id: swapId,
    }, {
      onSuccess: ({ order }) => {
        console.log(order.swaps)
      }
    })
  }

  // ...
}

export default Swap
