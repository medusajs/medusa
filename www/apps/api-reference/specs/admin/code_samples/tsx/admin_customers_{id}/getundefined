import React from "react"
import { useAdminCustomer } from "medusa-react"

type Props = {
  customerId: string
}

const Customer = ({ customerId }: Props) => {
  const { customer, isLoading } = useAdminCustomer(
    customerId
  )

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {customer && <span>{customer.first_name}</span>}
    </div>
  )
}

export default Customer
