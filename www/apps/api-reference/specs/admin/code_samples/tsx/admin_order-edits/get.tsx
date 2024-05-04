import React from "react"
import { useAdminOrderEdits } from "medusa-react"

const OrderEdits = () => {
  const { order_edits, isLoading } = useAdminOrderEdits()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {order_edits && !order_edits.length && (
        <span>No Order Edits</span>
      )}
      {order_edits && order_edits.length > 0 && (
        <ul>
          {order_edits.map((orderEdit) => (
            <li key={orderEdit.id}>
              {orderEdit.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default OrderEdits
