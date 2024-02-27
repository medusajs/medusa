import React from "react"
import { useAdminArchiveOrder } from "medusa-react"

type Props = {
  orderId: string
}

const Order = ({ orderId }: Props) => {
  const archiveOrder = useAdminArchiveOrder(
    orderId
  )
  // ...

  const handleArchivingOrder = () => {
    archiveOrder.mutate(void 0, {
      onSuccess: ({ order }) => {
        console.log(order.status)
      }
    })
  }

  // ...
}

export default Order
