import React from "react"
import { useAdminUpdateOrder } from "medusa-react"

type Props = {
  orderId: string
}

const Order = ({ orderId }: Props) => {
  const updateOrder = useAdminUpdateOrder(
    orderId
  )

  const handleUpdate = (
    email: string
  ) => {
    updateOrder.mutate({
      email,
    }, {
      onSuccess: ({ order }) => {
        console.log(order.email)
      }
    })
  }

  // ...
}

export default Order
