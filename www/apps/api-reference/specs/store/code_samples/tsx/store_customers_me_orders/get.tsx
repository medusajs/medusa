import React from "react"
import { useCustomerOrders } from "medusa-react"

const Orders = () => {
  // refetch a function that can be used to
  // re-retrieve orders after the customer logs in
  const { orders, isLoading } = useCustomerOrders()

  return (
    <div>
      {isLoading && <span>Loading orders...</span>}
      {orders?.length && (
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
