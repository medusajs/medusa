import React from "react"
import { useAddShippingMethodToCart } from "medusa-react"

type Props = {
  cartId: string
}

const Cart = ({ cartId }: Props) => {
  const addShippingMethod = useAddShippingMethodToCart(cartId)

  const handleAddShippingMethod = (
    optionId: string
  ) => {
    addShippingMethod.mutate({
      option_id: optionId,
    }, {
      onSuccess: ({ cart }) => {
        console.log(cart.shipping_methods)
      }
    })
  }

  // ...
}

export default Cart
