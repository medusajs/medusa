import React from "react"
import { useAdminCompleteOrder } from "medusa-react"

type Props = {
  orderId: string
}

const Order = ({ orderId }: Props) => {
  const completeOrder = useAdminCompleteOrder(
    orderId
  )
  // ...

  const handleComplete = () => {
    completeOrder.mutate(void 0, {
      onSuccess: ({ order }) => {
        console.log(order.status)
      }
    })
  }

  // ...
}

export default Order
