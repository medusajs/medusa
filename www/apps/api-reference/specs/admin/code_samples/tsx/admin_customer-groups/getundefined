import React from "react"
import { useAdminCustomerGroups } from "medusa-react"

const CustomerGroups = () => {
  const {
    customer_groups,
    isLoading,
  } = useAdminCustomerGroups()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {customer_groups && !customer_groups.length && (
        <span>No Customer Groups</span>
      )}
      {customer_groups && customer_groups.length > 0 && (
        <ul>
          {customer_groups.map(
            (customerGroup) => (
              <li key={customerGroup.id}>
                {customerGroup.name}
              </li>
            )
          )}
        </ul>
      )}
    </div>
  )
}

export default CustomerGroups
