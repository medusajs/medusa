import React from "react"
import { useAdminDeletePaymentCollection } from "medusa-react"

type Props = {
  paymentCollectionId: string
}

const PaymentCollection = ({ paymentCollectionId }: Props) => {
  const deleteCollection = useAdminDeletePaymentCollection(
    paymentCollectionId
  )
  // ...

  const handleDelete = () => {
    deleteCollection.mutate(void 0, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default PaymentCollection
