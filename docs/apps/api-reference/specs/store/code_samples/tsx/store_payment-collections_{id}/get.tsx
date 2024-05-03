import React from "react"
import { usePaymentCollection } from "medusa-react"

type Props = {
  paymentCollectionId: string
}

const PaymentCollection = ({
  paymentCollectionId
}: Props) => {
  const {
    payment_collection,
    isLoading
  } = usePaymentCollection(
    paymentCollectionId
  )

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {payment_collection && (
        <span>{payment_collection.status}</span>
      )}
    </div>
  )
}

export default PaymentCollection
