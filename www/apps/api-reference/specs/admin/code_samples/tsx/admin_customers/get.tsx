import React from "react"
import { useAdminCustomers } from "medusa-react"

const Customers = () => {
  const { customers, isLoading } = useAdminCustomers()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {customers && !customers.length && (
        <span>No customers</span>
      )}
      {customers && customers.length > 0 && (
        <ul>
          {customers.map((customer) => (
            <li key={customer.id}>{customer.first_name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Customers
