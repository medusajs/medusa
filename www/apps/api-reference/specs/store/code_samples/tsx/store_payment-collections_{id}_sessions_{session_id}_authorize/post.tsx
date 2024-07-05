import React from "react"
import { useAuthorizePaymentSession } from "medusa-react"

type Props = {
  paymentCollectionId: string
}

const PaymentCollection = ({
  paymentCollectionId
}: Props) => {
  const authorizePaymentSession = useAuthorizePaymentSession(
    paymentCollectionId
  )
  // ...

  const handleAuthorizePayment = (paymentSessionId: string) => {
    authorizePaymentSession.mutate(paymentSessionId, {
      onSuccess: ({ payment_collection }) => {
        console.log(payment_collection.payment_sessions)
      }
    })
  }

  // ...
}

export default PaymentCollection
