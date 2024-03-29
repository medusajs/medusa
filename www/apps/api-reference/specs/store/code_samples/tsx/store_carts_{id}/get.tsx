import React from "react"
import { useGetCart } from "medusa-react"

type Props = {
  cartId: string
}

const Cart = ({ cartId }: Props) => {
  const { cart, isLoading } = useGetCart(cartId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {cart && cart.items.length === 0 && (
        <span>Cart is empty</span>
      )}
      {cart && cart.items.length > 0 && (
        <ul>
          {cart.items.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Cart
