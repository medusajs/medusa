import React from "react"
import { useManageMultiplePaymentSessions } from "medusa-react"

type Props = {
  paymentCollectionId: string
}

const PaymentCollection = ({
  paymentCollectionId
}: Props) => {
  const managePaymentSessions = useManageMultiplePaymentSessions(
    paymentCollectionId
  )

  const handleManagePaymentSessions = () => {
    // Total amount = 10000

    // Example 1: Adding two new sessions
    managePaymentSessions.mutate({
      sessions: [
        {
          provider_id: "stripe",
          amount: 5000,
        },
        {
          provider_id: "manual",
          amount: 5000,
        },
      ]
    }, {
      onSuccess: ({ payment_collection }) => {
        console.log(payment_collection.payment_sessions)
      }
    })

    // Example 2: Updating one session and removing the other
    managePaymentSessions.mutate({
      sessions: [
        {
          provider_id: "stripe",
          amount: 10000,
          session_id: "ps_123456"
        },
      ]
    }, {
      onSuccess: ({ payment_collection }) => {
        console.log(payment_collection.payment_sessions)
      }
    })
  }

  // ...
}

export default PaymentCollection
