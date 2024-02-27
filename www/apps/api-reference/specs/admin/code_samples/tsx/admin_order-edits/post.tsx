import React from "react"
import { useAdminCreateOrderEdit } from "medusa-react"

const CreateOrderEdit = () => {
  const createOrderEdit = useAdminCreateOrderEdit()

  const handleCreateOrderEdit = (orderId: string) => {
    createOrderEdit.mutate({
      order_id: orderId,
    }, {
      onSuccess: ({ order_edit }) => {
        console.log(order_edit.id)
      }
    })
  }

  // ...
}

export default CreateOrderEdit
