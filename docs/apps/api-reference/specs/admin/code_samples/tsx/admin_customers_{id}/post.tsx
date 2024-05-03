import React from "react"
import { useAdminUpdateCustomer } from "medusa-react"

type CustomerData = {
  first_name: string
  last_name: string
  email: string
  password: string
}

type Props = {
  customerId: string
}

const Customer = ({ customerId }: Props) => {
  const updateCustomer = useAdminUpdateCustomer(customerId)
  // ...

  const handleUpdate = (customerData: CustomerData) => {
    updateCustomer.mutate(customerData)
  }

  // ...
}

export default Customer
