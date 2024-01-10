import React from "react"
import { useRefreshPaymentSession } from "medusa-react"

type Props = {
  cartId: string
}

const Cart = ({ cartId }: Props) => {
  const refreshPaymentSession = useRefreshPaymentSession(cartId)

  const handleRefresh = (
    providerId: string
  ) => {
    refreshPaymentSession.mutate({
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
