import React from "react"
import {
  useAdminCancelOrderEdit
} from "medusa-react"

type Props = {
  orderEditId: string
}

const OrderEdit = ({ orderEditId }: Props) => {
  const cancelOrderEdit =
    useAdminCancelOrderEdit(
      orderEditId
    )

  const handleCancel = () => {
    cancelOrderEdit.mutate(void 0, {
      onSuccess: ({ order_edit }) => {
        console.log(
          order_edit.id
        )
      }
    })
  }

  // ...
}

export default OrderEdit
