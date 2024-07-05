import React from "react"
import { useManagePaymentSession } from "medusa-react"

type Props = {
  paymentCollectionId: string
}

const PaymentCollection = ({
  paymentCollectionId
}: Props) => {
  const managePaymentSession = useManagePaymentSession(
    paymentCollectionId
  )

  const handleManagePaymentSession = (
    providerId: string
  ) => {
    managePaymentSession.mutate({
      provider_id: providerId
    }, {
      onSuccess: ({ payment_collection }) => {
        console.log(payment_collection.payment_sessions)
      }
    })
  }

  // ...
}

export default PaymentCollection
