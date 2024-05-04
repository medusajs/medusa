import React from "react"
import { RefundReason } from "@medusajs/medusa"
import { useAdminPaymentsRefundPayment } from "medusa-react"

type Props = {
  paymentId: string
}

const Payment = ({ paymentId }: Props) => {
  const refund = useAdminPaymentsRefundPayment(
    paymentId
  )
  // ...

  const handleRefund = (
    amount: number,
    reason: RefundReason,
    note: string
  ) => {
    refund.mutate({
      amount,
      reason,
      note
    }, {
      onSuccess: ({ refund }) => {
        console.log(refund.amount)
      }
    })
  }

  // ...
}

export default Payment
