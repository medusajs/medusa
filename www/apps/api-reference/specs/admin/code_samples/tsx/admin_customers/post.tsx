import React from "react"
import { useAdminCreateCustomer } from "medusa-react"

type CustomerData = {
  first_name: string
  last_name: string
  email: string
  password: string
}

const CreateCustomer = () => {
  const createCustomer = useAdminCreateCustomer()
  // ...

  const handleCreate = (customerData: CustomerData) => {
    createCustomer.mutate(customerData, {
      onSuccess: ({ customer }) => {
        console.log(customer.id)
      }
    })
  }

  // ...
}

export default CreateCustomer
