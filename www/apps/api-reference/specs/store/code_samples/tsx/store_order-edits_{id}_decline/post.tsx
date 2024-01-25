import React from "react"
import { useDeclineOrderEdit } from "medusa-react"

type Props = {
  orderEditId: string
}

const OrderEdit = ({ orderEditId }: Props) => {
  const declineOrderEdit = useDeclineOrderEdit(orderEditId)
  // ...

  const handleDeclineOrderEdit = (
    declinedReason: string
  ) => {
    declineOrderEdit.mutate({
      declined_reason: declinedReason,
    }, {
      onSuccess: ({ order_edit }) => {
        console.log(order_edit.declined_at)
      }
    })
  }

  // ...
}

export default OrderEdit
