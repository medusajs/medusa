import React from "react"
import { useAdminAddShippingMethod } from "medusa-react"

type Props = {
  orderId: string
}

const Order = ({ orderId }: Props) => {
  const addShippingMethod = useAdminAddShippingMethod(
    orderId
  )
  // ...

  const handleAddShippingMethod = (
    optionId: string,
    price: number
  ) => {
    addShippingMethod.mutate({
      option_id: optionId,
      price
    }, {
      onSuccess: ({ order }) => {
        console.log(order.shipping_methods)
      }
    })
  }

  // ...
}

export default Order
