import React from "react"
import { useCreatePaymentSession } from "medusa-react"

type Props = {
  cartId: string
}

const Cart = ({ cartId }: Props) => {
  const createPaymentSession = useCreatePaymentSession(cartId)

  const handleComplete = () => {
    createPaymentSession.mutate(void 0, {
      onSuccess: ({ cart }) => {
        console.log(cart.payment_sessions)
      }
    })
  }

  // ...
}

export default Cart
