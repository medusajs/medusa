import React from "react"
import { useUpdatePaymentSession } from "medusa-react"

type Props = {
  cartId: string
}

const Cart = ({ cartId }: Props) => {
  const updatePaymentSession = useUpdatePaymentSession(cartId)

  const handleUpdate = (
    providerId: string,
    data: Record<string, unknown>
  ) => {
    updatePaymentSession.mutate({
      provider_id: providerId,
      data
    }, {
      onSuccess: ({ cart }) => {
        console.log(cart.payment_session)
      }
    })
  }

  // ...
}

export default Cart
