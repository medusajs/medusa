import React from "react"
import { useAdminCreateShipment } from "medusa-react"

type Props = {
  orderId: string
}

const Order = ({ orderId }: Props) => {
  const createShipment = useAdminCreateShipment(
    orderId
  )
  // ...

  const handleCreate = (
    fulfillmentId: string
  ) => {
    createShipment.mutate({
      fulfillment_id: fulfillmentId,
    }, {
      onSuccess: ({ order }) => {
        console.log(order.fulfillment_status)
      }
    })
  }

  // ...
}

export default Order
