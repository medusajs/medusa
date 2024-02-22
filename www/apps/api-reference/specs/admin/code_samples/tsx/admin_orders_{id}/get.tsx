import React from "react"
import { useAdminOrder } from "medusa-react"

type Props = {
  orderId: string
}

const Order = ({ orderId }: Props) => {
  const {
    order,
    isLoading,
  } = useAdminOrder(orderId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {order && <span>{order.display_id}</span>}

    </div>
  )
}

export default Order
