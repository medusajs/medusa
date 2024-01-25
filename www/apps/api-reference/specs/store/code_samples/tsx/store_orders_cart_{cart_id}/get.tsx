import React from "react"
import { useCartOrder } from "medusa-react"

type Props = {
  cartId: string
}

const Order = ({ cartId }: Props) => {
  const {
    order,
    isLoading,
  } = useCartOrder(cartId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {order && <span>{order.display_id}</span>}

    </div>
  )
}

export default Order
