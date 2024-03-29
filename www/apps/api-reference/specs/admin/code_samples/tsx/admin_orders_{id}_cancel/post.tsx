import React from "react"
import { useAdminCancelOrder } from "medusa-react"

type Props = {
  orderId: string
}

const Order = ({ orderId }: Props) => {
  const cancelOrder = useAdminCancelOrder(
    orderId
  )
  // ...

  const handleCancel = () => {
    cancelOrder.mutate(void 0, {
      onSuccess: ({ order }) => {
        console.log(order.status)
      }
    })
  }

  // ...
}

export default Order
