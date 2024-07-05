import React from "react"
import { useOrders } from "medusa-react"

type Props = {
  displayId: number
  email: string
}

const Order = ({
  displayId,
  email
}: Props) => {
  const {
    order,
    isLoading,
  } = useOrders({
    display_id: displayId,
    email,
  })

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {order && <span>{order.display_id}</span>}

    </div>
  )
}

export default Order
