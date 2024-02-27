import React from "react"
import { useAdminCustomerGroup } from "medusa-react"

type Props = {
  customerGroupId: string
}

const CustomerGroup = ({ customerGroupId }: Props) => {
  const { customer_group, isLoading } = useAdminCustomerGroup(
    customerGroupId
  )

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {customer_group && <span>{customer_group.name}</span>}
    </div>
  )
}

export default CustomerGroup
