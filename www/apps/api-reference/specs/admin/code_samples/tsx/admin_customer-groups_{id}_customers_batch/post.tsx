import React from "react"
import {
  useAdminAddCustomersToCustomerGroup,
} from "medusa-react"

type Props = {
  customerGroupId: string
}

const CustomerGroup = ({ customerGroupId }: Props) => {
  const addCustomers = useAdminAddCustomersToCustomerGroup(
    customerGroupId
  )
  // ...

  const handleAddCustomers= (customerId: string) => {
    addCustomers.mutate({
      customer_ids: [
        {
          id: customerId,
        },
      ],
    })
  }

  // ...
}

export default CustomerGroup
