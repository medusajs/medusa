import React from "react"
import { useCreateLineItem } from "medusa-react"

type Props = {
  cartId: string
}

const Cart = ({ cartId }: Props) => {
  const createLineItem = useCreateLineItem(cartId)

  const handleAddItem = (
    variantId: string,
    quantity: number
  ) => {
    createLineItem.mutate({
      variant_id: variantId,
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
