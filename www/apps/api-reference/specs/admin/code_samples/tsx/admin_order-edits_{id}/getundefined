import React from "react"
import { useAdminOrderEdit } from "medusa-react"

type Props = {
  orderEditId: string
}

const OrderEdit = ({ orderEditId }: Props) => {
  const {
    order_edit,
    isLoading,
  } = useAdminOrderEdit(orderEditId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {order_edit && <span>{order_edit.status}</span>}
    </div>
  )
}

export default OrderEdit
