import React from "react"
import { useUpdateLineItem } from "medusa-react"

type Props = {
  cartId: string
}

const Cart = ({ cartId }: Props) => {
  const updateLineItem = useUpdateLineItem(cartId)

  const handleUpdateItem = (
    lineItemId: string,
    quantity: number
  ) => {
    updateLineItem.mutate({
      lineId: lineItemId,
      quantity,
    }, {
      onSuccess: ({ cart }) => {
        console.log(cart.items)
      }
    })
  }

  // ...
}

export default Cart
