import React from "react"
import { useOrderEdit } from "medusa-react"

type Props = {
  orderEditId: string
}

const OrderEdit = ({ orderEditId }: Props) => {
  const { order_edit, isLoading } = useOrderEdit(orderEditId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {order_edit && (
        <ul>
          {order_edit.changes.map((change) => (
            <li key={change.id}>{change.type}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default OrderEdit
