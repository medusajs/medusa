import React from "react"
import { useUpdateCart } from "medusa-react"

type Props = {
  cartId: string
}

const Cart = ({ cartId }: Props) => {
  const updateCart = useUpdateCart(cartId)

  const handleUpdate = (
    email: string
  ) => {
    updateCart.mutate({
      email
    }, {
      onSuccess: ({ cart }) => {
        console.log(cart.email)
      }
    })
  }

  // ...
}

export default Cart
