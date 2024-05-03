import React from "react"
import { useAdminUpdatePaymentCollection } from "medusa-react"

type Props = {
  paymentCollectionId: string
}

const PaymentCollection = ({ paymentCollectionId }: Props) => {
  const updateCollection = useAdminUpdatePaymentCollection(
    paymentCollectionId
  )
  // ...

  const handleUpdate = (
    description: string
  ) => {
    updateCollection.mutate({
      description
    }, {
      onSuccess: ({ payment_collection }) => {
        console.log(payment_collection.description)
      }
    })
  }

  // ...
}

export default PaymentCollection
