import React from "react"
import { useAuthorizePaymentSessionsBatch } from "medusa-react"

type Props = {
  paymentCollectionId: string
}

const PaymentCollection = ({
  paymentCollectionId
}: Props) => {
  const authorizePaymentSessions = useAuthorizePaymentSessionsBatch(
    paymentCollectionId
  )
  // ...

  const handleAuthorizePayments = (paymentSessionIds: string[]) => {
    authorizePaymentSessions.mutate({
      session_ids: paymentSessionIds
    }, {
      onSuccess: ({ payment_collection }) => {
        console.log(payment_collection.payment_sessions)
      }
    })
  }

  // ...
}

export default PaymentCollection
