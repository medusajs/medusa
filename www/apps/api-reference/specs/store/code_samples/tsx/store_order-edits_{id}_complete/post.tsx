import React from "react"
import { useCompleteOrderEdit } from "medusa-react"

type Props = {
  orderEditId: string
}

const OrderEdit = ({ orderEditId }: Props) => {
  const completeOrderEdit = useCompleteOrderEdit(
    orderEditId
  )
  // ...

  const handleCompleteOrderEdit = () => {
    completeOrderEdit.mutate(void 0, {
      onSuccess: ({ order_edit }) => {
        console.log(order_edit.confirmed_at)
      }
    })
  }

  // ...
}

export default OrderEdit
