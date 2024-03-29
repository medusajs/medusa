import React from "react"
import { useCompleteCart } from "medusa-react"

type Props = {
  cartId: string
}

const Cart = ({ cartId }: Props) => {
  const completeCart = useCompleteCart(cartId)

  const handleComplete = () => {
    completeCart.mutate(void 0, {
      onSuccess: ({ data, type }) => {
        console.log(data.id, type)
      }
    })
  }

  // ...
}

export default Cart
