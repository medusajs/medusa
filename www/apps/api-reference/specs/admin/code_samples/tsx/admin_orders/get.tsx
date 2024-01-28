import React from "react"
import { useAdminOrders } from "medusa-react"

const Orders = () => {
  const { orders, isLoading } = useAdminOrders()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {orders && !orders.length && <span>No Orders</span>}
      {orders && orders.length > 0 && (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>{order.display_id}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Orders
