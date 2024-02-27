import React from "react"
import { useAdminMarkPaymentCollectionAsAuthorized } from "medusa-react"

type Props = {
  paymentCollectionId: string
}

const PaymentCollection = ({ paymentCollectionId }: Props) => {
  const markAsAuthorized = useAdminMarkPaymentCollectionAsAuthorized(
    paymentCollectionId
  )
  // ...

  const handleAuthorization = () => {
    markAsAuthorized.mutate(void 0, {
      onSuccess: ({ payment_collection }) => {
        console.log(payment_collection.status)
      }
    })
  }

  // ...
}

export default PaymentCollection
