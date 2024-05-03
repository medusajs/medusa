import React from "react"
import { useAdminConfirmOrderEdit } from "medusa-react"

type Props = {
  orderEditId: string
}

const OrderEdit = ({ orderEditId }: Props) => {
  const confirmOrderEdit = useAdminConfirmOrderEdit(
    orderEditId
  )

  const handleConfirmOrderEdit = () => {
    confirmOrderEdit.mutate(void 0, {
      onSuccess: ({ order_edit }) => {
        console.log(
          order_edit.confirmed_at,
          order_edit.confirmed_by
        )
      }
    })
  }

  // ...
}

export default OrderEdit
