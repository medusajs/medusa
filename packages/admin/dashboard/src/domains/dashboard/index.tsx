import { Link } from "react-router-dom"
const DashboardRoute = () => {
  // const { orders, isLoading } = useAdminOrders({
  //   limit: 5,
  //   offset: 0,
  //   status: ["pending"],
  // })

  return (
    <div className="bg-gray-100">
      <h1 className="bg-gray-200">Dashboard</h1>
      <div>
        <ul>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/orders">Orders</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default DashboardRoute
