import { useAdminOrders } from "medusa-react"

export const OrdersRoute = () => {
  const { orders } = useAdminOrders()
  return (
    <div className="bg-gray-50">
      <h1>Orders</h1>
      <ul>
        {orders?.map((order) => {
          return <li key={order.id}>{order.id}</li>
        })}
      </ul>
    </div>
  )
}

export default OrdersRoute
