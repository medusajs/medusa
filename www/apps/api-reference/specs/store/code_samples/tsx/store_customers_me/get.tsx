import React from "react"
import { useMeCustomer } from "medusa-react"

const Customer = () => {
  const { customer, isLoading } = useMeCustomer()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {customer && (
        <span>{customer.first_name} {customer.last_name}</span>
      )}
    </div>
  )
}

export default Customer
