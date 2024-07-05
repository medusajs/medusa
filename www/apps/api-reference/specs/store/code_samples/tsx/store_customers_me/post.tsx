import React from "react"
import { useUpdateMe } from "medusa-react"

type Props = {
  customerId: string
}

const Customer = ({ customerId }: Props) => {
  const updateCustomer = useUpdateMe()
  // ...

  const handleUpdate = (
    firstName: string
  ) => {
    // ...
    updateCustomer.mutate({
      id: customerId,
      first_name: firstName,
    }, {
      onSuccess: ({ customer }) => {
        console.log(customer.first_name)
      }
    })
  }

  // ...
}

export default Customer
