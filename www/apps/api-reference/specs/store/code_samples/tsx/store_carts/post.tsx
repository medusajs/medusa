import React from "react"
import { useCreateCart } from "medusa-react"

type Props = {
  regionId: string
}

const Cart = ({ regionId }: Props) => {
  const createCart = useCreateCart()

  const handleCreate = () => {
    createCart.mutate({
      region_id: regionId
      // creates an empty cart
    }, {
      onSuccess: ({ cart }) => {
        console.log(cart.items)
      }
    })
  }

  // ...
}

export default Cart
