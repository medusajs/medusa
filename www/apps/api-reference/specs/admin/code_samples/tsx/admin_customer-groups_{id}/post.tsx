import React from "react"
import { useAdminUpdateCustomerGroup } from "medusa-react"

type Props = {
  customerGroupId: string
}

const CustomerGroup = ({ customerGroupId }: Props) => {
  const updateCustomerGroup = useAdminUpdateCustomerGroup(
    customerGroupId
  )
  // ..

  const handleUpdate = (name: string) => {
    updateCustomerGroup.mutate({
      name,
    })
  }

  // ...
}

export default CustomerGroup
