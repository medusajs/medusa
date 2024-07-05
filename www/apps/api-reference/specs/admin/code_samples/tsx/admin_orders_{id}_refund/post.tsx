import React from "react"
import { useAdminRefundPayment } from "medusa-react"

type Props = {
  orderId: string
}

const Order = ({ orderId }: Props) => {
  const refundPayment = useAdminRefundPayment(
    orderId
  )
  // ...

  const handleRefund = (
    amount: number,
    reason: string
  ) => {
    refundPayment.mutate({
      amount,
      reason,
    }, {
      onSuccess: ({ order }) => {
        console.log(order.refunds)
      }
    })
  }

  // ...
}

export default Order
