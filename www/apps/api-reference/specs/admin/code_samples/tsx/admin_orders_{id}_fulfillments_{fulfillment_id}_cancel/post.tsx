import React from "react"
import { useAdminCancelFulfillment } from "medusa-react"

type Props = {
  orderId: string
}

const Order = ({ orderId }: Props) => {
  const cancelFulfillment = useAdminCancelFulfillment(
    orderId
  )
  // ...

  const handleCancel = (
    fulfillmentId: string
  ) => {
    cancelFulfillment.mutate(fulfillmentId, {
      onSuccess: ({ order }) => {
        console.log(order.fulfillments)
      }
    })
  }

  // ...
}

export default Order
