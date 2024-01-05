import React from "react"
import { useAdminRequestReturn } from "medusa-react"

type Props = {
  orderId: string
}

const Order = ({ orderId }: Props) => {
  const requestReturn = useAdminRequestReturn(
    orderId
  )
  // ...

  const handleRequestingReturn = (
    itemId: string,
    quantity: number
  ) => {
    requestReturn.mutate({
      items: [
        {
          item_id: itemId,
          quantity
        }
      ]
    }, {
      onSuccess: ({ order }) => {
        console.log(order.returns)
      }
    })
  }

  // ...
}

export default Order
