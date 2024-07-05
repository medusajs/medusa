import React from "react"
import { useAdminCreateSwapShipment } from "medusa-react"

type Props = {
  orderId: string,
  swapId: string
}

const Swap = ({
  orderId,
  swapId
}: Props) => {
  const createShipment = useAdminCreateSwapShipment(
    orderId
  )
  // ...

  const handleCreateShipment = (
    fulfillmentId: string
  ) => {
    createShipment.mutate({
      swap_id: swapId,
      fulfillment_id: fulfillmentId,
    }, {
      onSuccess: ({ order }) => {
        console.log(order.swaps)
      }
    })
  }

  // ...
}

export default Swap
