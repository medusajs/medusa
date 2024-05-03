import React from "react"
import { usePaymentCollectionRefreshPaymentSession } from "medusa-react"

type Props = {
  paymentCollectionId: string
}

const PaymentCollection = ({
  paymentCollectionId
}: Props) => {
  const refreshPaymentSession = usePaymentCollectionRefreshPaymentSession(
    paymentCollectionId
  )
  // ...

  const handleRefreshPaymentSession = (paymentSessionId: string) => {
    refreshPaymentSession.mutate(paymentSessionId, {
      onSuccess: ({ payment_session }) => {
        console.log(payment_session.status)
      }
    })
  }

  // ...
}

export default PaymentCollection
