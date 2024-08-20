import { AdminPaymentCollection } from "@medusajs/types"

export const getTotalCaptured = (
  paymentCollections: AdminPaymentCollection[]
) =>
  paymentCollections.reduce((acc, paymentCollection) => {
    acc =
      acc +
      ((paymentCollection.captured_amount as number) -
        (paymentCollection.refunded_amount as number))
    return acc
  }, 0)

export const getTotalPending = (paymentCollections: AdminPaymentCollection[]) =>
  paymentCollections.reduce((acc, paymentCollection) => {
    acc +=
      (paymentCollection.amount as number) -
      (paymentCollection.captured_amount as number)

    return acc
  }, 0)
