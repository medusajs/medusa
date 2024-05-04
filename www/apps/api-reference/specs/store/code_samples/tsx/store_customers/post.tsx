import React from "react"
import { useCreateCustomer } from "medusa-react"

const RegisterCustomer = () => {
  const createCustomer = useCreateCustomer()
  // ...

  const handleCreate = (
    customerData: {
      first_name: string
      last_name: string
      email: string
      password: string
    }
  ) => {
    // ...
    createCustomer.mutate(customerData, {
      onSuccess: ({ customer }) => {
        console.log(customer.id)
      }
    })
  }

  // ...
}

export default RegisterCustomer
