import React from "react"
import { useAdminUpdateOrderEdit } from "medusa-react"

type Props = {
  orderEditId: string
}

const OrderEdit = ({ orderEditId }: Props) => {
  const updateOrderEdit = useAdminUpdateOrderEdit(
    orderEditId,
  )

  const handleUpdate = (
    internalNote: string
  ) => {
    updateOrderEdit.mutate({
      internal_note: internalNote
    }, {
      onSuccess: ({ order_edit }) => {
        console.log(order_edit.internal_note)
      }
    })
  }

  // ...
}

export default OrderEdit
