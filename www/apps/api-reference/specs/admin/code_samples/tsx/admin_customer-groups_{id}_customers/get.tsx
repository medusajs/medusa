import React from "react"
import { useAdminCustomerGroupCustomers } from "medusa-react"

type Props = {
  customerGroupId: string
}

const CustomerGroup = ({ customerGroupId }: Props) => {
  const {
    customers,
    isLoading,
  } = useAdminCustomerGroupCustomers(
    customerGroupId
  )

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

export default CustomerGroup
