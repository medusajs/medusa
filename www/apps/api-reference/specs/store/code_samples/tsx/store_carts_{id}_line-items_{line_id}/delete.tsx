import React from "react"
import { useDeleteLineItem } from "medusa-react"

type Props = {
  cartId: string
}

const Cart = ({ cartId }: Props) => {
  const deleteLineItem = useDeleteLineItem(cartId)

  const handleDeleteItem = (
    lineItemId: string
  ) => {
    deleteLineItem.mutate({
      lineId: lineItemId,
    }, {
      onSuccess: ({ cart }) => {
        console.log(cart.items)
      }
    })
  }

  // ...
}

export default Cart
