import React from "react"
import {
  useAdminRequestOrderEditConfirmation,
} from "medusa-react"

type Props = {
  orderEditId: string
}

const OrderEdit = ({ orderEditId }: Props) => {
  const requestOrderConfirmation =
    useAdminRequestOrderEditConfirmation(
      orderEditId
    )

  const handleRequestConfirmation = () => {
    requestOrderConfirmation.mutate(void 0, {
      onSuccess: ({ order_edit }) => {
        console.log(
          order_edit.requested_at,
          order_edit.requested_by
        )
      }
    })
  }

  // ...
}

export default OrderEdit
