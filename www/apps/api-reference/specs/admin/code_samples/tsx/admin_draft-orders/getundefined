import React from "react"
import { useAdminDraftOrders } from "medusa-react"

const DraftOrders = () => {
  const { draft_orders, isLoading } = useAdminDraftOrders()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {draft_orders && !draft_orders.length && (
        <span>No Draft Orders</span>
      )}
      {draft_orders && draft_orders.length > 0 && (
        <ul>
          {draft_orders.map((order) => (
            <li key={order.id}>{order.display_id}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default DraftOrders
