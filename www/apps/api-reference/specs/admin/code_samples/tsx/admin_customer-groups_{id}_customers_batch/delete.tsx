import React from "react"
import {
  useAdminRemoveCustomersFromCustomerGroup,
} from "medusa-react"

type Props = {
  customerGroupId: string
}

const CustomerGroup = ({ customerGroupId }: Props) => {
  const removeCustomers =
    useAdminRemoveCustomersFromCustomerGroup(
      customerGroupId
    )
  // ...

  const handleRemoveCustomer = (customerId: string) => {
    removeCustomers.mutate({
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
