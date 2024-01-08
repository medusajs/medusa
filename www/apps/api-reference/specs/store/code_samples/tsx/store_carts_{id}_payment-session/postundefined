import React from "react"
import { useSetPaymentSession } from "medusa-react"

type Props = {
  cartId: string
}

const Cart = ({ cartId }: Props) => {
  const setPaymentSession = useSetPaymentSession(cartId)

  const handleSetPaymentSession = (
    providerId: string
  ) => {
    setPaymentSession.mutate({
      provider_id: providerId,
    }, {
      onSuccess: ({ cart }) => {
        console.log(cart.payment_session)
      }
    })
  }

  // ...
}

export default Cart
