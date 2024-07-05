import React from "react"
import { useDeletePaymentSession } from "medusa-react"

type Props = {
  cartId: string
}

const Cart = ({ cartId }: Props) => {
  const deletePaymentSession = useDeletePaymentSession(cartId)

  const handleDeletePaymentSession = (
    providerId: string
  ) => {
    deletePaymentSession.mutate({
      provider_id: providerId,
    }, {
      onSuccess: ({ cart }) => {
        console.log(cart.payment_sessions)
      }
    })
  }

  // ...
}

export default Cart
