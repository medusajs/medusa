import React from "react"
import { useAdminDeleteOrderEdit } from "medusa-react"

type Props = {
  orderEditId: string
}

const OrderEdit = ({ orderEditId }: Props) => {
  const deleteOrderEdit = useAdminDeleteOrderEdit(
    orderEditId
  )

  const handleDelete = () => {
    deleteOrderEdit.mutate(void 0, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default OrderEdit
