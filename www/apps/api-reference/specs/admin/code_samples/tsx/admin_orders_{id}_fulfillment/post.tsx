import React from "react"
import { useAdminCreateFulfillment } from "medusa-react"

type Props = {
  orderId: string
}

const Order = ({ orderId }: Props) => {
  const createFulfillment = useAdminCreateFulfillment(
    orderId
  )
  // ...

  const handleCreateFulfillment = (
    itemId: string,
    quantity: number
  ) => {
    createFulfillment.mutate({
      items: [
        {
          item_id: itemId,
          quantity,
        },
      ],
    }, {
      onSuccess: ({ order }) => {
        console.log(order.fulfillments)
      }
    })
  }

  // ...
}

export default Order
