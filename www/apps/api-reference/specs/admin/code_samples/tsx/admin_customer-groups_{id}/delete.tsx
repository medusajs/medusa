import React from "react"
import { useAdminDeleteCustomerGroup } from "medusa-react"

type Props = {
  customerGroupId: string
}

const CustomerGroup = ({ customerGroupId }: Props) => {
  const deleteCustomerGroup = useAdminDeleteCustomerGroup(
    customerGroupId
  )
  // ...

  const handleDeleteCustomerGroup = () => {
    deleteCustomerGroup.mutate()
  }

  // ...
}

export default CustomerGroup
